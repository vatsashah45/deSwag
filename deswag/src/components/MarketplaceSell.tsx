"use client";
import { useState } from "react";

export default function MarketplaceSell() {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");

  const list = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call /market/list then ask user to approve NFT if needed
    alert(`List token #${tokenId} for ${price} USDC (stub)`);
  };

  return (
    <div className="card max-w-xl">
      <div className="p-6 md:p-8">
        <h3 className="text-lg font-semibold mb-4">List an Item for Sale</h3>
        <form onSubmit={list} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Token ID</label>
            <input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price (USDC)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="e.g. 5"
            />
          </div>
          <button className="btn btn-primary w-full">List for Sale</button>
        </form>
      </div>
    </div>
  );
}
