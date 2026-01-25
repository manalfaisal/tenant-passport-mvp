import { useMemo, useState } from "react";

export default function Dashboard({ tickets, updateTicketStatus, resetDemo }) {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTickets = useMemo(() => {
    if (statusFilter === "All") return tickets;
    return tickets.filter((t) => t.status === statusFilter);
  }, [tickets, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Requests submitted from the form show up here.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetDemo}
            className="rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
            title="Resets tickets back to sample demo data"
          >
            Reset demo data
          </button>

          <span className="text-sm text-gray-600">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          >
            <option>All</option>
            <option>New</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-center text-gray-600">
          No tickets match this filter.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTickets.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              updateTicketStatus={updateTicketStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TicketCard({ ticket, updateTicketStatus }) {
  const pill = pillStyle(ticket.status);

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            {ticket.category}: {ticket.description.slice(0, 40)}
            {ticket.description.length > 40 ? "…" : ""}
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            {ticket.name} • Unit {ticket.unit}
            {ticket.city || ticket.state ? (
                <> • {formatLocation(ticket.city, ticket.state)}</>
            ) : null}
          </p>


          <p className={`mt-2 text-sm font-medium ${urgencyStyle(ticket.urgency)}`}>
            Urgency: {ticket.urgency}
          </p>
        </div>

        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pill}`}>
          {ticket.status}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <select
          value={ticket.status}
          onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
          className="rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
        >
          <option>New</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
          View details →
        </button>
      </div>
    </div>
  );
}

function pillStyle(status) {
  if (status === "New") return "bg-blue-50 text-blue-700";
  if (status === "In Progress") return "bg-yellow-50 text-yellow-800";
  return "bg-green-50 text-green-700";
}
function formatLocation(city, state) {
    const c = (city || "").trim();
    const s = (state || "").trim();
    if (c && s) return `${c}, ${s}`;
    return c || s;
}
  

function urgencyStyle(urgency) {
  if (urgency === "High") return "text-red-600";
  if (urgency === "Medium") return "text-yellow-700";
  return "text-gray-700";
}
