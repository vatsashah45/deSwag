// src/components/Navbar.tsx
"use client";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="bg-[var(--surface-2)]/12 backdrop-blur-md border-b border-[var(--border)]/40">
        <div className="container-app py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--ink-strong)] text-white text-sm">🧦</span>
            <div className="leading-tight">
              <div className="font-semibold text-[var(--ink-strong)]">deSwag</div>
              <div className="text-[11px] subtle -mt-0.5">NFC Swag Marketplace</div>
            </div>
          </div>
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
