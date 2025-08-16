"use client";
import { useSignEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { encodeFunctionData, type Address, http, createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";
import { useState } from "react";

// --- paste your deployed address here ---
const CONTRACT_ADDRESS = "0xYourDeployedContract"; // checksummed

// Minimal ABI for mintTo(address,string)
const ABI = [
  {
    type: "function",
    name: "mintTo",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI_", type: "string" },
    ],
    outputs: [],
  },
] as const;

export default function MintNftButton() {
  const { signEvmTransaction } = useSignEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const [status, setStatus] = useState<"idle" | "signing" | "sent" | "confirmed" | "error">("idle");
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http("https://sepolia.base.org"),
  });

  const handleMint = async () => {
    setError(null);
    setStatus("signing");

    try {
      if (!evmAddress) throw new Error("Connect wallet first");

      // Example tokenURI (use your Walrus/IPFS/HTTPS link)
      const tokenURI = "https://your-domain.com/metadata/1.json";

      // Encode the call to mintTo(address,string)
      const data = encodeFunctionData({
        abi: ABI,
        functionName: "mintTo",
        args: [evmAddress as Address, tokenURI],
      });

      // Sign with CDP (no ETH value needed)
      const { signedTransaction } = await signEvmTransaction({
        evmAccount: evmAddress as Address,
        transaction: {
          to: CONTRACT_ADDRESS as Address,
          data,
          value: 0n,
          chainId: baseSepolia.id,    // 84532
          type: "eip1559",
          // You can optionally pre-fill gas, maxFeePerGas, etc.
        },
        network: "base-sepolia",
      });

      // Broadcast
      const txHash = await client.sendRawTransaction({ serializedTransaction: signedTransaction });
      setHash(txHash);
      setStatus("sent");

      // Wait for 1 confirmation
      const receipt = await client.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
      console.log("Confirmed in block:", receipt.blockNumber);
      setStatus("confirmed");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message ?? "Mint failed");
    }
  };

  return (
    <div className="space-y-2">
      <button onClick={handleMint} disabled={status === "signing" || !evmAddress}>
        {status === "signing" ? "Signing…" : "Mint NFT (Base Sepolia)"}
      </button>

      {hash && (
        <div>
          <div>tx: {hash}</div>
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View on BaseScan
          </a>
        </div>
      )}

      {status === "confirmed" && <div style={{ color: "green" }}>✅ Mint confirmed</div>}
      {status === "error" && <div style={{ color: "crimson" }}>❌ {error}</div>}
    </div>
  );
}
