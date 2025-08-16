"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getActiveListings, purchaseListing } from "@/app/utils/Marketplace";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import Purchase from "./CDP/Purchase";

type ListingUI = Awaited<ReturnType<typeof getActiveListings>>[number];

export default function MarketplaceBuy() {
  const [items, setItems] = useState<ListingUI[]>([]);
  const [loading, setLoading] = useState(true);
  const { evmAddress } = useEvmAddress();

  useEffect(() => {
    (async () => {
      try {
        const rows = await getActiveListings();
        setItems(rows);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const buy = async (id: number) => {
    if (!evmAddress) return alert("Please sign in");
    try {
      await purchaseListing({ listingId: id, buyer: evmAddress });
      setItems((prev) => prev.filter((p) => p.id !== id));
      alert("Purchased (DB recorded). On-chain transfer later.");
    } catch (e: any) {
      alert(e?.message ?? "Failed to purchase");
    }
  };

  if (loading) return <div className="text-[var(--muted)]">Loading listings…</div>;
  if (!items.length) return <div className="text-[var(--muted)]">No listings yet.</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i.id} className="group">
          <ProductCard
            image={i.image}
            title={i.name}
            subtitle={i.companyId ? `Company #${i.companyId}` : "Community"}
            price={`${i.priceEth.toFixed(6)} ETH`}
            vendor={i.seller.slice(0, 6) + "…" + i.seller.slice(-4)}
            badge="For sale"
          />
          <div className="mt-3">
            <button
              onClick={() => buy(i.id)}
              className="w-full h-10 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)]"
            >
              Buy
            </button>
            <Purchase></Purchase>
          </div>
        </div>
      ))}
    </div>
  );
}
