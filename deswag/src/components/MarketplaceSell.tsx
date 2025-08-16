"use client";
import { useEffect, useState } from "react";
import { useCurrentUser, useEvmAddress } from "@coinbase/cdp-hooks";
import { createListing, getOwnedItems } from "@/app/utils/Marketplace";

type OwnedUI = Awaited<ReturnType<typeof getOwnedItems>>[number];

export default function MarketplaceSell() {
  const { currentUser } = useCurrentUser();
  const { evmAddress } = useEvmAddress();

  const [items, setItems] = useState<OwnedUI[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    if (!evmAddress) return;
    (async () => {
      const rows = await getOwnedItems(evmAddress);
      setItems(rows);
    })();
  }, [evmAddress]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !evmAddress) return alert("Please sign in");
    if (!selected) return alert("Choose an item");
    const val = Number(price);
    if (!isFinite(val) || val <= 0) return alert("Invalid price");

    try {
      await createListing({ userItemId: selected, priceEth: val, seller: evmAddress });
      setItems((prev) => prev.map((it) => it.userItemId === selected ? { ...it, listed: true } : it));
      setSelected(null);
      setPrice("");
      alert("Listed!");
    } catch (e: any) {
      alert(e?.message ?? "Listing failed");
    }
  };

  return (
    <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl shadow-sm border border-[var(--card-border)] max-w-2xl">
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--ink)]">List an Item for Sale</h3>
          <p className="text-sm text-[var(--muted)]">Select one of your swag NFTs and set a price in ETH.</p>
        </div>

        {!evmAddress ? (
          <div className="text-[var(--muted)]">Please sign in to see your items.</div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--ink)] mb-1">Your Items</label>
              <select
                value={selected ?? ""}
                onChange={(e) => setSelected(Number(e.target.value))}
                className="w-full rounded-xl border px-4 py-3 bg-white/70 border-[var(--card-border)]"
              >
                <option value="" disabled>Choose an item</option>
                {items.map((it) => (
                  <option key={it.userItemId} value={it.userItemId} disabled={it.listed}>
                    {it.name} {it.listed ? "(already listed)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--ink)] mb-1">Price (ETH)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 0.05"
                className="w-full rounded-xl border px-4 py-3 bg-white/70 border-[var(--card-border)]"
              />
            </div>

            <div className="md:col-span-2">
              <button className="w-full h-11 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)]">
                Create Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
