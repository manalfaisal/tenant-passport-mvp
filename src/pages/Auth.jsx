import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // "signup" | "signin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created ✅ You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMsg("Signed in ✅");
      }
    } catch (err) {
      setMsg(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-2xl p-6 shadow-sm space-y-4">
      <h1 className="text-2xl font-bold">
        {mode === "signup" ? "Create account" : "Sign in"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />

        <button
          className="w-full bg-gray-900 text-white rounded-xl py-2 font-medium hover:bg-gray-800 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
        </button>
      </form>

      {msg ? <p className="text-sm text-gray-600">{msg}</p> : null}

      <button
        className="text-sm underline text-gray-700"
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
      >
        Switch to {mode === "signup" ? "sign in" : "sign up"}
      </button>
    </div>
  );
}
