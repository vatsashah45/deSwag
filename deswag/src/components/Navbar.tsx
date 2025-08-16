"use client";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import TabNav from "@/components/TabNav";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="inline-flex h-6 w-6 rounded-md bg-black text-white items-center justify-center">⚡</span>
          <span>NFC Marketplace</span>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  );
}
