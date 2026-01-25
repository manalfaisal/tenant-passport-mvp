import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { getUserRole, setUserRole } from "../lib/roles";

export default function ChooseRole() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const id = data?.session?.user?.id || null;
      setUserId(id);

      // If already has role, skip this page
      if (id) {
        const role = getUserRole(id);
        if (role === "tenant") navigate("/submit", { replace: true });
        if (role === "manager") navigate("/dashboard", { replace: true });
      }
    });
  }, [navigate]);

  function pick(role) {
    if (!userId) return;
    setUserRole(userId, role);
    navigate(role === "tenant" ? "/submit" : "/dashboard", { replace: true });
  }

  return (
    <div className="max-w-xl mx-auto bg-white border rounded-2xl p-6 shadow-sm space-y-4">
      <h1 className="text-2xl font-bold">Choose your role</h1>
      <p className="text-gray-600">
        This helps us show the right view. You can change it later during MVP testing.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => pick("tenant")}
          className="rounded-2xl border p-5 text-left hover:bg-gray-50"
        >
          <p className="font-semibold">Tenant</p>
          <p className="text-sm text-gray-600 mt-1">
            Submit requests and track status.
          </p>
        </button>

        <button
          onClick={() => pick("manager")}
          className="rounded-2xl border p-5 text-left hover:bg-gray-50"
        >
          <p className="font-semibold">Manager</p>
          <p className="text-sm text-gray-600 mt-1">
            View dashboard and manage requests.
          </p>
        </button>
      </div>
    </div>
  );
}
