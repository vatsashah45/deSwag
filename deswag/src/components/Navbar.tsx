"use client";
import ConnectWalletButton from "@/components/ConnectWalletButton";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="bg-white/70 backdrop-blur border-b border-[var(--card-border)]">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--ink)] text-white text-sm">🧦</span>
            <div className="leading-tight">
              <div className="font-semibold text-[var(--ink)]">deSwag</div>
              <div className="text-[11px] text-[var(--muted)] -mt-0.5">NFC Swag Marketplace</div>
            </div>
          </div>
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
