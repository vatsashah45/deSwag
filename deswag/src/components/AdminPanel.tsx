"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [name, setName] = useState("");
  const [cap, setCap] = useState("");

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Create item "${name}" with supply ${cap} (stub)`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* create */}
      <div className="card card-hover lg:col-span-1">
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-semibold mb-6">Create Swag Item</h3>
          <form onSubmit={createItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Item Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="VIP Access Pass"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Supply Cap</label>
              <input
                value={cap}
                onChange={(e) => setCap(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="50"
              />
            </div>
            <button className="btn-primary w-full h-11 rounded-xl">Create Item</button>
          </form>
        </div>
      </div>

      {/* analytics placeholder */}
      <div className="card card-hover lg:col-span-2">
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-semibold mb-2">Live Analytics</h3>
          <p className="text-sm text-slate-600 mb-6">
            Claims per item, remaining supply, and unique claimers (live sockets soon).
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs text-slate-500">Total Claims</div>
              <div className="text-2xl font-bold mt-1">124</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs text-slate-500">Unique Claimers</div>
              <div className="text-2xl font-bold mt-1">97</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs text-slate-500">Items Remaining</div>
              <div className="text-2xl font-bold mt-1">31</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
