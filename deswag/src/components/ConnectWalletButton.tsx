"use client";

import { useRef, useState } from "react";
import { useCurrentUser, useSignOut } from "@coinbase/cdp-hooks";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import UserProfile from "./CDP/UserProfile";

export default function WalletStatus() {
  const { currentUser } = useCurrentUser();
  const { signOut } = useSignOut();
  const [opened, setOpened] = useState(false);

  // We'll mount the real AuthButton invisibly and click it programmatically
  const authHostRef = useRef<HTMLDivElement>(null);
  const openAuth = () => {
    const realBtn = authHostRef.current?.querySelector("button");
    realBtn?.click();
  };

  if (!currentUser) {
    return (
      <div className="relative inline-block">
        {/* invisible real button */}
        <div
          ref={authHostRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          <AuthButton />
        </div>

        {/* your styled button */}
        <button
          onClick={openAuth}
          className="
            px-5 h-10 rounded-xl
            bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)]
            text-white font-medium shadow
            hover:shadow-md active:scale-[.98] transition
            border border-white/40
          "
        >
          Sign in
        </button>
      </div>
    );
  }

  const addr = currentUser.evmAccounts?.[0] ?? "";
  const short = addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "Profile";

  return (
    <>
      {opened ? <UserProfile /> : null}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpened((s) => !s)}
          title={addr}
          className="
            px-3 py-1.5 rounded-full
            bg-white/70 backdrop-blur
            border border-[var(--card-border)]
            text-[var(--ink)] font-medium
            hover:bg-white transition
            max-w-40 truncate
          "
        >
          {short}
        </button>

        <button
          onClick={async () => {
            await signOut();     // clear CDP session
            setOpened(false);
          }}
          className="
            px-3 py-1.5 rounded-full
            bg-red-500 text-white
            hover:bg-red-600 transition
          "
        >
          Logout
        </button>
      </div>
    </>
  );
}
