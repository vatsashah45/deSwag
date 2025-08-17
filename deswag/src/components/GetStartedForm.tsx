"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrentUser, useEvmAddress } from "@coinbase/cdp-hooks";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { saveWalletNfc, getNfcByWallet } from "@/app/utils/MapNFCToWallet";
import { useRouter } from "next/navigation";

export default function GetStartedForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [linkedCode, setLinkedCode] = useState<string | null>(null);

  const { currentUser } = useCurrentUser();
  const { evmAddress } = useEvmAddress();
  const router = useRouter();

  // match the navbar/tabs glass style
  const glass =
    "rounded-2xl bg-[var(--surface-2)]/12 backdrop-blur-md border border-[var(--border)]/40 shadow-sm";
  const fieldBg = "bg-[var(--surface-2)]/8"; // very light, readable over gradient

  // host div for the hidden AuthButton
  const authHostRef = useRef<HTMLDivElement>(null);
  const openAuth = () => {
    const realBtn = authHostRef.current?.querySelector("button");
    realBtn?.click();
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!evmAddress) return;
      const existing = await getNfcByWallet(evmAddress);
      if (cancelled) return;
      if (existing) {
        setLinkedCode(existing);
        // router.replace("/");
      }
    })();
    return () => { cancelled = true; };
  }, [evmAddress, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!/^[A-Z0-9]{8}$/i.test(code)) {
      setMsg("Please enter a valid 8-character NFC code.");
      return;
    }
    if (!currentUser || !evmAddress) {
      setMsg("Please sign in first.");
      return;
    }

    setLoading(true);
    try {
      await saveWalletNfc(evmAddress, code.toUpperCase());
      setMsg("Success! Your NFC code is now linked to your wallet.");
      setLinkedCode(code.toUpperCase());
    } catch (err: any) {
      setMsg(err?.message ?? "Could not set up wallet. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (linkedCode) {
    return (
      <div className={`w-full max-w-xl ${glass}`}>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--brand-600)] text-white">✅</span>
            <h2 className="text-lg font-semibold text-[var(--ink-strong)]">You’re all set</h2>
          </div>
          <p className="text-sm subtle mb-2">
            Your wallet is already linked to NFC code{" "}
            <b className="text-[var(--ink-strong)]">{linkedCode}</b>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-xl ${glass}`}>
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--brand-600)] text-white">⚡</span>
          <h2 className="text-lg font-semibold text-[var(--ink-strong)]">NFC Wallet Setup</h2>
        </div>
        <p className="text-sm subtle mb-6">Scan or enter your NFC code to get started</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ink-strong)]">NFC Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter your 8-character NFC code"
              className={`w-full rounded-xl border px-4 py-3 outline-none
                          border-[var(--border)] ${fieldBg}
                          focus:ring-2 focus:ring-[var(--brand-300)] placeholder-[var(--muted)]`}
            />
          </div>

          {!currentUser ? (
            <>
              {/* Invisible real AuthButton so the SDK works */}
              <div
                ref={authHostRef}
                className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
                aria-hidden="true"
              >
                <AuthButton />
              </div>

              {/* Pastel-styled trigger */}
              <button
                type="button"
                onClick={openAuth}
                className="w-full h-11 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)]"
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-medium text-white shadow-sm hover:shadow-md active:scale-[.98] transition bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] disabled:opacity-70"
            >
              {loading ? "Linking..." : "Link NFC to Wallet"}
            </button>
          )}

          {msg && <div className="text-center text-sm pt-1 text-[var(--ink-strong)]">{msg}</div>}
        </form>

        <div className="text-center text-sm subtle mt-6">
          Don’t have an NFC code?{" "}
          <span className="font-medium text-[var(--ink-strong)]">Request one from event organizers</span>
        </div>
      </div>
    </div>
  );
}
