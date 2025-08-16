"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [name, setName] = useState("");
  const [cap, setCap] = useState("");

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /admin/items
    alert(`Create item "${name}" with supply ${cap} (stub)`);
  };

  return (
    <div className="card max-w-2xl">
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Create Swag Item</h3>
          <p className="text-sm text-slate-600">Define item metadata and supply cap.</p>
        </div>
        <form onSubmit={createItem} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Item Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="VIP Access Pass"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Supply Cap</label>
            <input
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="50"
            />
          </div>
          <div className="md:col-span-2">
            <button className="btn btn-primary w-full">Create Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}
