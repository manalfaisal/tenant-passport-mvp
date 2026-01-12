import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  async function testSupabase() {
    const { data, error } = await supabase.auth.getSession();
    alert(error ? error.message : "Supabase connected ✅");
    console.log("session:", data);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={testSupabase}
        className="mb-6 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Test Supabase Connection
      </button>

      <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-10">
        <p className="text-sm font-medium text-gray-600">Phase 1 MVP</p>

        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
          Tenant Passport
        </h1>

        <p className="mt-4 text-gray-600 text-lg max-w-2xl">
          A simple way for tenants and property managers to handle requests with
          less friction: submit issues, track progress, and keep communication
          organized.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/submit"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 font-medium hover:bg-gray-800 transition"
          >
            Submit a Request
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 font-medium hover:bg-gray-50 transition"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Feature
          title="Fast intake"
          desc="Tenants can submit issues in seconds with clear categories and urgency."
        />
        <Feature
          title="Manager clarity"
          desc="Everything shows up in one dashboard—no scattered texts or missed details."
        />
        <Feature
          title="Built to expand"
          desc="Later: SMS concierge, vendor sourcing, and “passport” transparency features."
        />
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
