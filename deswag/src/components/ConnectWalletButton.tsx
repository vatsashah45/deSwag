import { useCurrentUser } from "@coinbase/cdp-hooks";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import UserProfile from "./CDP/UserProfile";
import { useState } from "react";

export default function WalletStatus() {
  const { currentUser } = useCurrentUser();

  const [opened, setOpened] = useState(false);

  if (!currentUser) {
    return <AuthButton className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" />;
  }

  const addr = currentUser.evmAccounts?.[0] ?? "";

  // short form (0x1234...abcd)
  const short = addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

  return (
    <>
      {
        opened ? <UserProfile></UserProfile> : <></>
      }
      <div className="ellipsis max-w-36" onClick={() => setOpened((e) => !e)}>
        {short}
      </div>
    </>
  );
}