import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Submit({ addTicket }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "Plumbing",
    urgency: "Low",
    description: "",
  });

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // basic validation (simple on purpose)
    if (!form.name.trim() || !form.unit.trim() || !form.description.trim()) {
      alert("Please fill out name, unit number, and description.");
      return;
    }

    addTicket(form);

    // Send them straight to dashboard so they can see it worked
    navigate("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submit a Request</h1>
        <p className="text-gray-600 mt-2">
          Tell us what’s going on. This will appear on the manager dashboard.
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name">
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                placeholder="Manal"
              />
            </Field>

            <Field label="Unit number">
              <input
                value={form.unit}
                onChange={(e) => setField("unit", e.target.value)}
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                placeholder="302"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="w-full rounded-xl border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              >
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Heating/Cooling</option>
                <option>Appliances</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="Urgency">
              <select
                value={form.urgency}
                onChange={(e) => setField("urgency", e.target.value)}
                className="w-full rounded-xl border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </Field>
          </div>

          <Field label="Describe the issue">
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="w-full rounded-xl border px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              placeholder="What happened? When did it start? Any details that help?"
            />
          </Field>

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 text-white py-3 font-medium hover:bg-gray-800 transition"
          >
            Submit request
          </button>

          <p className="text-xs text-gray-500">
            Next step: persist this to a database (Firebase/Supabase).
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
