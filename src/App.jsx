import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

import { supabase } from "./lib/supabaseClient";

const STORAGE_KEY = "tenant_passport_tickets_v1";

const DEFAULT_TICKETS = [
  {
    id: crypto.randomUUID(),
    name: "Jordan",
    unit: "302",
    category: "Plumbing",
    urgency: "Medium",
    description: "Leaky faucet under the sink.",
    status: "New",
    createdAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: "Amina",
    unit: "115",
    category: "Heating/Cooling",
    urgency: "High",
    description: "Heater not turning on.",
    status: "In Progress",
    createdAt: Date.now(),
  },
];

function loadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-lg text-sm font-medium transition",
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);

  // Tickets (still local for now — we’ll move to Supabase DB right after)
  const [tickets, setTickets] = useState(() => {
    const saved = loadTickets();
    if (saved) return saved;
    return DEFAULT_TICKETS;
  });

  // Save tickets locally (until DB step)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  // Auth session tracking (Supabase recommended pattern)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function addTicket(newTicket) {
    setTickets((prev) => [
      {
        id: crypto.randomUUID(),
        status: "New",
        createdAt: Date.now(),
        ...newTicket,
      },
      ...prev,
    ]);
  }

  function updateTicketStatus(id, status) {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  function resetDemo() {
    const fresh = DEFAULT_TICKETS.map((t) => ({
      ...t,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }));
    setTickets(fresh);
  }

  return (
    <BrowserRouter>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gray-900" />
            <span className="font-semibold text-lg">Tenant Passport</span>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden sm:flex items-center gap-1">
              <NavItem to="/" label="Home" />
              <NavItem to="/submit" label="Submit" />
              <NavItem to="/dashboard" label="Dashboard" />
            </nav>

            {session ? (
              <button
                onClick={handleLogout}
                className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm font-medium hover:bg-gray-800"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/auth"
                className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm font-medium hover:bg-gray-800"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />

            <Route
              path="/submit"
              element={
                <ProtectedRoute session={session}>
                  <Submit addTicket={addTicket} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute session={session}>
                  <Dashboard
                    tickets={tickets}
                    updateTicketStatus={updateTicketStatus}
                    resetDemo={resetDemo}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}
