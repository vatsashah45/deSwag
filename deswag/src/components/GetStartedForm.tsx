"use client";
import { useState } from "react";

export default function GetStartedForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!/^[A-Z0-9]{8}$/i.test(code)) {
      setMsg("Please enter a valid 8-character NFC code.");
      return;
    }

    setLoading(true);
    try {
      // TODO: call backend
      setMsg("Success! Your wallet is ready to connect.");
    } catch {
      setMsg("Could not set up wallet. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-hover w-full max-w-xl">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white">⚡</span>
          <h2 className="text-lg font-semibold">NFC Wallet Setup</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">Scan or enter your NFC code to get started</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">NFC Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter your 8-character NFC code"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full h-11 rounded-xl disabled:opacity-70">
            {loading ? "Connecting..." : "Connect / Create Wallet"}
          </button>

          {msg && <div className="text-center text-sm pt-1 text-slate-700">{msg}</div>}
        </form>

        <div className="text-center text-sm text-slate-500 mt-6">
          Don’t have an NFC code?{" "}
          <span className="font-medium text-slate-700">Request one from event organizers</span>
        </div>
      </div>
    </div>
  );
}
