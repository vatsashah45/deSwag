"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { addCompanySwag, getCompanySwag } from "@/app/utils/company/AddSwag";
import { addUserItem, userOwnsItem } from "@/app/utils/company/TrackClaims";

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

  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [companyItems, setCompanyItems] = useState<CompanyItem[]>([]);

  const [loadingById, setLoadingById] = useState<Record<number, boolean>>({});
  const [toastById, setToastById] = useState<Record<number, string | null>>({});

  const [COMPANY_ID, SETCOMPANY_ID] = useState("Coinbase");

  // TODO: replace with your real admin gate
  const isAdmin = useMemo(() => true, []);

  // Load items for this company
  useEffect(() => {
    (async () => {
      try {
        const rows = await getCompanySwag(COMPANY_ID);
        setCompanyItems((rows as CompanyItem[]) || []);
      } catch (e: any) {
        setToast(e?.message ?? "Failed to load items");
      }
    })();
  }, []);

  // PRIVATE: create new item
  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!isAdmin) { setToast("Admin only"); return; }
    if (!name.trim() || !cap.trim()) { setToast("Enter name and supply cap"); return; }

    const capNum = Number(cap);
    if (!Number.isFinite(capNum) || capNum <= 0) { setToast("Supply cap must be > 0"); return; }

    try {
      setLoading(true);
      await addCompanySwag(COMPANY_ID, name.trim(), capNum); // image optional 4th arg
      const rows = await getCompanySwag(COMPANY_ID);
      setCompanyItems((rows as CompanyItem[]) || []);
      setName(""); setCap("");
      setToast("✅ Item created");
    } catch (e: any) {
      setToast(e?.message ?? "Could not create item");
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC: claim by scanned NFC code
  const [scannedNfc, setScannedNfc] = useState<string>("");

  const claimItemForScan = async (itemId: number) => {
    const code = scannedNfc.trim().toUpperCase();

    // reset toast only for this item
    setToastById((prev) => ({ ...prev, [itemId]: null }));

    try {
      setLoadingById((prev) => ({ ...prev, [itemId]: true }));

      // 1) find kvps.id (user_id) by nfc_hash
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

      // 2) own-check
      const owned = await userOwnsItem(userId, String(itemId));
      if (owned) {
        setToastById((prev) => ({ ...prev, [itemId]: "User already owns this item" }));
        return;
      }

      // 3) grant item
      await addUserItem(userId, String(itemId));

      // 4) decrement quantity atomically
      //TODO: find out how i can decrement
      const { error } = await supabaseBrowser.rpc("decrement_item_quantity", {
        target_id: itemId,
      });
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
      <div className="absolute right-0 -top-2 flex items-center gap-3">
        <span className={`text-xs ${mode === "private" ? "font-semibold" : "text-slate-500"}`}>Private</span>
        <button
          onClick={() => setMode(m => (m === "private" ? "public" : "private"))}
          className={`h-6 w-12 rounded-full transition relative ${
            mode === "public" ? "bg-green-500/70" : "bg-slate-300"
          }`}
          aria-label="Toggle mode"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              mode === "public" ? "left-6" : "left-1"
            }`}
          />
        </button>
        <span className={`text-xs ${mode === "public" ? "font-semibold" : "text-slate-500"}`}>Public</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        {/* LEFT: Private create card OR Public claim card */}
        <div className="card card-hover lg:col-span-1">
          <div className="p-6 md:p-8">
            {mode === "private" ? (
              <>
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
                  <div>
                    <label className="block text-sm font-medium">Company</label>
                    <input
                      value={COMPANY_ID}
                      onChange={(e) => SETCOMPANY_ID(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="VIP Access Pass"
                    />
                  </div>
                  <button disabled={loading} className="btn-primary w-full h-11 rounded-xl">
                    {loading ? "Saving..." : "Create Item"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-6">Scan to Claim</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-4">NFC Code (simply paste NFC link received at the top)</label>
                    <input
                      value={scannedNfc}
                      onChange={(e) => setScannedNfc(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="8-char code"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Enter or scan the attendee’s NFC code, then click “Claim” next to an item.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Items + analytics placeholder */}
        <div className="card card-hover lg:col-span-2">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-2">
              {mode === "private" ? "Live Analytics" : "Available Items"}
            </h3>
            {mode === "private" ? (
              <>
                <p className="text-sm text-slate-600 mb-6">
                  Claims per item, remaining supply, and unique claimers (live sockets soon).
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500">Total Claims</div>
                    <div className="text-2xl font-bold mt-1">—</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500">Unique Claimers</div>
                    <div className="text-2xl font-bold mt-1">—</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-xs text-slate-500">Items Remaining</div>
                    <div className="text-2xl font-bold mt-1">—</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {companyItems.length === 0 ? (
                  <div className="text-sm text-slate-500">No items yet.</div>
                ) : (
                      companyItems.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
        >
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-xs text-slate-500">
              Quantity: {row.quantity}
            </div>
            {toastById[row.id] && (
              <div className="text-xs mt-1 text-green-600">{toastById[row.id]}</div>
            )}
          </div>
          <button
            disabled={loadingById[row.id] || !scannedNfc}
            onClick={() => claimItemForScan(row.id)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
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
        <div className="fixed bottom-4 right-4 rounded-lg bg-black text-white px-4 py-2 shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
