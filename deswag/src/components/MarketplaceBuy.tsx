"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getActiveListings, purchaseListing } from "@/app/utils/Marketplace";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import Purchase from "./CDP/Purchase";
import { fetchBlob } from "@/app/utils/uploadFileToWalrus";

type ListingUI = Awaited<ReturnType<typeof getActiveListings>>[number];

export default function MarketplaceBuy() {
  const [items, setItems] = useState<(ListingUI & { imageUrl?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { evmAddress } = useEvmAddress();

  useEffect(() => {
    let active = true;
    const objectUrls: string[] = [];

    (async () => {
      try {
        const rows = await getActiveListings();
        console.log(rows)
        const withImages = await Promise.all(
          rows.map(async (row) => {
            console.log(row)
            if (row.image_url) {
              try {
                const blob = await fetchBlob(row.image_url); // Walrus blob
                console.log(blob)
                const url = URL.createObjectURL(blob);
                objectUrls.push(url);
                return { ...row, imageUrl: url };
              } catch (err) {
                console.error("Failed to fetch blob", err);
              }
            }
            return row;
          })
        );

        if (active) setItems(withImages);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      // cleanup all blob URLs
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const buy = async (id: number) => {
    if (!evmAddress) return alert("Please sign in");
    try {
      await purchaseListing({ listingId: id, buyer: evmAddress });
      setItems((prev) => prev.filter((p) => p.id !== id));
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
            image={i.imageUrl ?? "/placeholder.png"} // ✅ use blob URL
            title={i.name}
            subtitle={i.companyId ? `Company #${i.companyId}` : "Community"}
            price={`${i.priceEth.toFixed(2)} ETH`}
            vendor={i.seller.slice(0, 6) + "…" + i.seller.slice(-4)}
            badge="For sale"
          />
          <div className="mt-3">
            <div
              onClick={() => buy(i.id)}
              className="w-full h-10 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] items-center justify-center flex"
            >
              <Purchase
                id={i.id}                         // row id in item_forsale
                itemId={i.itemId ?? i.foreign_id} // swag item id
                to={i.seller}                     // seller wallet
                value={BigInt(Math.floor(i.priceEth))}
                onSuccess={(id) => {
                  setItems((prev) => prev.filter((x) => x.id !== id));
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
