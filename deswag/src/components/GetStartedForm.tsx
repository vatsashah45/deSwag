"use client";

import { useEffect, useState } from "react";
import { useCurrentUser, useEvmAddress } from "@coinbase/cdp-hooks";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { saveWalletNfc, getNfcByWallet } from "@/app/utils/MapNFCToWallet";
import { useRouter } from "next/navigation";

export default function GetStartedForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [linkedCode, setLinkedCode] = useState<string | null>(null); // ← store existing link
  const { currentUser } = useCurrentUser();
  const { evmAddress } = useEvmAddress();
  const router = useRouter();

  // Check if this wallet is already linked
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!evmAddress) return; // not connected yet
      const existing = await getNfcByWallet(evmAddress); // returns string | null
      if (cancelled) return;
      if (existing) {
        setLinkedCode(existing);

        // OPTION A: redirect away (uncomment one)
        // router.replace("/user-profile");
        // router.replace("/"); // or wherever

        // OPTION B: just show an "all set" card below (handled by render)
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [evmAddress, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!/^[A-Z0-9]{8}$/i.test(code)) {
      setMsg("Please enter a valid 8-character NFC code.");
      return;
    }
    if (!currentUser || !evmAddress) {
      setMsg("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      await saveWalletNfc(evmAddress, code.toUpperCase());
      setMsg("Success! Your NFC code is now linked to your wallet.");
      setLinkedCode(code.toUpperCase()); // so the page switches to the “all set” state
    } catch (err: any) {
      setMsg(err?.message ?? "Could not set up wallet. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // If already linked and you chose not to redirect, show an "all set" card instead of the form
  if (linkedCode) {
    return (
      <div className="w-full max-w-xl bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl shadow-sm border border-[var(--card-border)]">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--brand-600)] text-white">✅</span>
            <h2 className="text-lg font-semibold text-[var(--ink)]">You’re all set</h2>
          </div>
          <p className="text-sm text-[var(--muted)] mb-6">
            Your wallet is already linked to NFC code <b>{linkedCode}</b>.
          </p>
        </div>
      </div>
    );
  }

  // Default: original Get Started UI
  return (
    <div className="w-full max-w-xl bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl shadow-sm border border-[var(--card-border)]">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--brand-600)] text-white">⚡</span>
          <h2 className="text-lg font-semibold text-[var(--ink)]">NFC Wallet Setup</h2>
        </div>
        <p className="text-sm text-[var(--muted)] mb-6">Scan or enter your NFC code to get started</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ink)]">NFC Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter your 8-character NFC code"
              className="w-full rounded-xl border px-4 py-3 outline-none border-[var(--card-border)] bg-white/70 focus:ring-2 focus:ring-[var(--brand-300)]"
            />
          </div>

          {!currentUser ? (
            <AuthButton className="w-full h-11 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] disabled:opacity-70" />
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] disabled:opacity-70"
            >
              {loading ? "Linking..." : "Link NFC to Wallet"}
            </button>
          )}

          {msg && <div className="text-center text-sm pt-1 text-[var(--ink)]">{msg}</div>}
        </form>

        <div className="text-center text-sm text-[var(--muted)] mt-6">
          Don’t have an NFC code? <span className="font-medium text-[var(--ink)]">Request one from event organizers</span>
        </div>
      </div>
    </div>
  );
}
