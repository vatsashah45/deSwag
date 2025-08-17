"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { addCompanySwag, getCompanySwag } from "@/app/utils/company/AddSwag";
import { addUserItem, userOwnsItem } from "@/app/utils/company/TrackClaims";
import { uploadBlob } from "@/app/utils/uploadFileToWalrus";

const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CompanyItem = {
  id: string | number;
  company_id: string;
  name: string;
  quantity: number;
  image?: string | null;
  created_at?: string;
};

export default function AdminPanel() {
  const [mode, setMode] = useState<"private" | "public">("private");
  const [name, setName] = useState("");
  const [cap, setCap] = useState("");
  const [imageUrl, setImageurl] = useState<string | File>("");

  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [companyItems, setCompanyItems] = useState<CompanyItem[]>([]);
  const [loadingById, setLoadingById] = useState<Record<number, boolean>>({});
  const [toastById, setToastById] = useState<Record<number, string | null>>({});

  const [COMPANY_ID, SETCOMPANY_ID] = useState("Coinbase");

  // glass tokens to match navbar/tabs
  const glass =
    "rounded-2xl bg-[var(--surface-2)]/12 backdrop-blur-md border border-[var(--border)]/40 shadow-sm";
  const glassSoft =
    "rounded-xl bg-[var(--surface-2)]/8 backdrop-blur-md border border-[var(--border)]/30";
  const fieldBg = "bg-[var(--surface-2)]/8";

  const isAdmin = useMemo(() => true, []);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getCompanySwag(COMPANY_ID);
        setCompanyItems((rows as CompanyItem[]) || []);
      } catch (e: any) {
        setToast(e?.message ?? "Failed to load items");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!isAdmin) { setToast("Admin only"); return; }
    if (!name.trim() || !cap.trim()) { setToast("Enter name and supply cap"); return; }

    const capNum = Number(cap);
    if (!Number.isFinite(capNum) || capNum <= 0) { setToast("Supply cap must be > 0"); return; }

    try {
      setLoading(true);
      const receivedBlob = await uploadBlob(imageUrl);
      await addCompanySwag(
        COMPANY_ID,
        name.trim(),
        capNum,
        receivedBlob.newlyCreated?.blobObject?.blobId
      );
      const rows = await getCompanySwag(COMPANY_ID);
      setCompanyItems((rows as CompanyItem[]) || []);
      setName("");
      setCap("");
      setToast("✅ Item created");
    } catch (e: any) {
      setToast(e?.message ?? "Could not create item");
    } finally {
      setLoading(false);
    }
  };

  const [scannedNfc, setScannedNfc] = useState<string>("");

  const claimItemForScan = async (itemId: number) => {
    const code = scannedNfc.trim().toUpperCase();
    setToastById((prev) => ({ ...prev, [itemId]: null }));

    try {
      setLoadingById((prev) => ({ ...prev, [itemId]: true }));

      const { data: kvp, error: kvpErr } = await supabaseBrowser
        .from("kvps")
        .select("id")
        .eq("nfc_hash", code)
        .maybeSingle();
      if (kvpErr) throw kvpErr;
      if (!kvp?.id) {
        setToastById((prev) => ({ ...prev, [itemId]: "No wallet linked to this NFC" }));
        return;
      }
      const userId = String(kvp.id);

      const owned = await userOwnsItem(userId, String(itemId));
      if (owned) {
        setToastById((prev) => ({ ...prev, [itemId]: "User already owns this item" }));
        return;
      }

      await addUserItem(userId, String(itemId));

      const { error } = await supabaseBrowser.rpc("decrement_item_quantity", { target_id: itemId });
      if (error) throw error;

      setToastById((prev) => ({ ...prev, [itemId]: "✅ Claimed" }));
    } catch (e: any) {
      setToastById((prev) => ({ ...prev, [itemId]: e?.message ?? "Claim failed" }));
    } finally {
      setLoadingById((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <div className="relative">
      {/* top-right mode slider */}
      <div className="fixed top-20 right-6 z-[9999] flex items-center gap-3">
        <span className={`text-xs ${mode === "private" ? "font-semibold" : "subtle"}`}>Private</span>
        <button
          onClick={() => setMode((m) => (m === "private" ? "public" : "private"))}
          className={`h-6 w-12 rounded-full transition relative
            ${mode === "public" ? "bg-emerald-400/25" : "bg-[var(--surface-2)]/15"}
            backdrop-blur-sm border border-[var(--border)]/30`}
          aria-label="Toggle mode"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition
              ${mode === "public" ? "left-6" : "left-1"}`}
          />
        </button>
        <span className={`text-xs ${mode === "public" ? "font-semibold" : "subtle"}`}>Public</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* LEFT: Private create card OR Public claim card */}
        <div className={`${glass} lg:col-span-1`}>
          <div className="p-6 md:p-8">
            {mode === "private" ? (
              <>
                <h3 className="text-lg font-semibold text-[var(--ink-strong)] mb-6">Create Swag Item</h3>
                <form onSubmit={createItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink-strong)]">Item Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-xl border border-[var(--border)] ${fieldBg} px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-300)] placeholder-[var(--muted)]`}
                      placeholder="VIP Access Pass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink-strong)]">Supply Cap</label>
                    <input
                      value={cap}
                      onChange={(e) => setCap(e.target.value)}
                      className={`w-full rounded-xl border border-[var(--border)] ${fieldBg} px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-300)] placeholder-[var(--muted)]`}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink-strong)]">Company</label>
                    <input
                      value={COMPANY_ID}
                      onChange={(e) => SETCOMPANY_ID(e.target.value)}
                      className={`w-full rounded-xl border border-[var(--border)] ${fieldBg} px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-300)] placeholder-[var(--muted)]`}
                      placeholder="Coinbase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink-strong)]">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImageurl(file);
                      }}
                      className={`w-full rounded-xl border border-[var(--border)] ${fieldBg} px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-300)]`}
                    />
                  </div>
                  <button disabled={loading} className="w-full h-11 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] disabled:opacity-70">
                    {loading ? "Saving..." : "Create Item"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-[var(--ink-strong)] mb-6">Scan to Claim</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--ink-strong)] mb-2">
                      NFC Code (paste the NFC link/code)
                    </label>
                    <input
                      value={scannedNfc}
                      onChange={(e) => setScannedNfc(e.target.value.toUpperCase())}
                      className={`w-full rounded-xl border border-[var(--border)] ${fieldBg} px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-300)] placeholder-[var(--muted)]`}
                      placeholder="LINK1234"
                    />
                  </div>
                  <p className="text-xs subtle">
                    Enter or scan the attendee’s NFC code, then click “Claim” next to an item.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Items + analytics placeholder */}
        <div className={`${glass} lg:col-span-2`}>
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-[var(--ink-strong)] mb-2">
              {mode === "private" ? "Live Analytics" : "Available Items"}
            </h3>

            {mode === "private" ? (
              <>
                <p className="text-sm subtle mb-6">
                  Claims per item, remaining supply, and unique claimers (live sockets soon).
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className={`${glassSoft} p-4`}>
                    <div className="text-xs subtle">Total Claims</div>
                    <div className="text-2xl font-bold mt-1 text-[var(--ink-strong)]">—</div>
                  </div>
                  <div className={`${glassSoft} p-4`}>
                    <div className="text-xs subtle">Unique Claimers</div>
                    <div className="text-2xl font-bold mt-1 text-[var(--ink-strong)]">—</div>
                  </div>
                  <div className={`${glassSoft} p-4`}>
                    <div className="text-xs subtle">Items Remaining</div>
                    <div className="text-2xl font-bold mt-1 text-[var(--ink-strong)]">—</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {companyItems.length === 0 ? (
                  <div className="text-sm subtle">No items yet.</div>
                ) : (
                  companyItems.map((row) => (
                    <div
                      key={row.id}
                      className={`${glassSoft} p-4 flex items-center justify-between`}
                    >
                      <div>
                        <div className="font-medium text-[var(--ink-strong)]">{row.name}</div>
                        <div className="text-xs subtle">Quantity: {row.quantity}</div>
                        {toastById[row.id] && (
                          <div className="text-xs mt-1 text-emerald-600">{toastById[row.id]}</div>
                        )}
                      </div>
                      <button
                        disabled={loadingById[row.id] || !scannedNfc}
                        onClick={() => claimItemForScan(Number(row.id))}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white disabled:opacity-60"
                      >
                        {loadingById[row.id] ? "Claiming…" : "Claim"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-[var(--surface-2)]/60 text-white px-4 py-2 shadow-lg backdrop-blur-md border border-[var(--border)]/30">
          {toast}
        </div>
      )}
    </div>
  );
}
