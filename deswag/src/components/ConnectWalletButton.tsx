"use client";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

export default function ConnectWalletButton() {
  return (
    <button className="btn btn-primary">
      <AuthButton></AuthButton>
    </button>
  );
}
