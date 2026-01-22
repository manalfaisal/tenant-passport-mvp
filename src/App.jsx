import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ChooseRole from "./pages/ChooseRole";

import { supabase } from "./lib/supabaseClient";
import { getUserRole } from "./lib/roles";

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

function RequireAuth({ session, children }) {
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}

function RequireRole({ role, children, userRole }) {
  if (!userRole) return <Navigate to="/choose-role" replace />;
  if (userRole !== role)
    return (
      <Navigate
        to={userRole === "tenant" ? "/submit" : "/dashboard"}
        replace
      />
    );
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);

  // Tickets now come from Supabase (no localStorage)
  const [tickets, setTickets] = useState([]);

  // Track auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id || null;

  // Role is stored locally per user id for now
  const userRole = useMemo(() => getUserRole(userId), [userId, session]);

  // Load tickets from Supabase once logged in
  useEffect(() => {
    async function load() {
      if (!session) return;

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("property_key", "demo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      setTickets(data || []);
    }

    load();
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // Insert ticket into Supabase
  async function addTicket(newTicket) {
    const payload = {
      property_key: "demo",
      ...newTicket,
    };

    const { data, error } = await supabase
      .from("tickets")
      .insert(payload)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setTickets((prev) => [data, ...prev]);
  }

  // Update status in Supabase
  async function updateTicketStatus(id, status) {
    const { data, error } = await supabase
      .from("tickets")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setTickets((prev) => prev.map((t) => (t.id === id ? data : t)));
  }

  // Reset demo data in Supabase (delete + reseed)
  async function resetDemo() {
    const defaults = [
      {
        property_key: "demo",
        name: "Jordan",
        unit: "302",
        city: "San Francisco",
        state: "CA",
        category: "Plumbing",
        urgency: "Medium",
        description: "Leaky faucet under the sink.",
        status: "New",
      },
      {
        property_key: "demo",
        name: "Amina",
        unit: "115",
        city: "San Francisco",
        state: "CA",
        category: "Heating/Cooling",
        urgency: "High",
        description: "Heater not turning on.",
        status: "In Progress",
      },
    ];

    const del = await supabase.from("tickets").delete().eq("property_key", "demo");
    if (del.error) {
      alert(del.error.message);
      return;
    }

    const ins = await supabase.from("tickets").insert(defaults).select();
    if (ins.error) {
      alert(ins.error.message);
      return;
    }

    setTickets(ins.data || []);
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

              {/* Only show the link that matches role (after role chosen) */}
              {session && userRole === "tenant" ? (
                <NavItem to="/submit" label="Submit" />
              ) : null}
              {session && userRole === "manager" ? (
                <NavItem to="/dashboard" label="Dashboard" />
              ) : null}

              {/* If logged in but role not chosen, show link */}
              {session && !userRole ? (
                <NavItem to="/choose-role" label="Choose Role" />
              ) : null}
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
              path="/choose-role"
              element={
                <RequireAuth session={session}>
                  <ChooseRole />
                </RequireAuth>
              }
            />

            <Route
              path="/submit"
              element={
                <RequireAuth session={session}>
                  <RequireRole role="tenant" userRole={userRole}>
                    <Submit addTicket={addTicket} />
                  </RequireRole>
                </RequireAuth>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RequireAuth session={session}>
                  <RequireRole role="manager" userRole={userRole}>
                    <Dashboard
                      tickets={tickets}
                      updateTicketStatus={updateTicketStatus}
                      resetDemo={resetDemo}
                    />
                  </RequireRole>
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}
