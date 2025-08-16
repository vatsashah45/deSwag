"use client";
import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { type MouseEvent, useCallback, useState } from "react";
import { createClient } from "@/app/utils/CreateSupabaseClient";

const supabase = createClient();
const WEI_PER_ETH = 10n ** 18n;

interface Props {
  id: string | number;              // row id in `item_forsale`
  itemId: string | number;          // the actual swag item id being sold
  to?: string;
  value?: bigint;
  balance?: string;
  onSuccess?: (id: string | number) => void;
}

export default function Purchase(props: Props) {
  const { id, itemId, onSuccess } = props;
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const [isPending, setIsPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendTransaction = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!evmAddress) return;
      e.preventDefault();

      setIsPending(true);
      setErrorMsg(null);

      try {
        // 1) Blockchain tx
        const { transactionHash } = await sendEvmTransaction({
          transaction: {
            to: (props.to ?? evmAddress) as `0x${string}`,
            value: (props.value ?? 0n) * WEI_PER_ETH,
            gas: 21000n,
            chainId: 84532,
            type: "eip1559",
          },
          evmAccount: evmAddress,
          network: "base-sepolia",
        });

        // 2) Insert into user_items (transfer ownership)
        const { error: insertErr } = await supabase
          .from("user_items")
          .insert([{ user_id: evmAddress, item_id: itemId }]); // ⚡ map your schema
        if (insertErr) throw insertErr;

        // 3) Delete listing from item_forsale
        const { error: deleteErr } = await supabase
          .from("item_forsale")
          .delete()
          .eq("user_item_id", id)
          .select(); // 👈 force return deleted row(s)
        if (deleteErr) throw deleteErr;

        setTransactionHash(transactionHash);
        onSuccess?.(id);
      } catch (err: any) {
        if (err?.message?.includes("Insufficient balance")) {
          alert(err);
          setErrorMsg("❌ Insufficient funds. Please add ETH to cover value + gas.");
        } else {
          setErrorMsg(err.message ?? "Transaction failed");
        }
      } finally {
        setIsPending(false);
      }
    },
    [id, itemId, evmAddress, sendEvmTransaction, onSuccess, props.to, props.value],
  );

  return (
    <div>
      <button onClick={handleSendTransaction} disabled={isPending}>
        {isPending ? "Processing…" : "Purchase item"}
      </button>

      {transactionHash && (
        <p className="text-green-600 mt-2">
          ✅ Success! Tx: {transactionHash}
        </p>
      )}

      {errorMsg && (
        <p className="text-red-600 mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
