"use client";
import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { type MouseEvent, useCallback, useMemo, useState } from "react";

const WEI_PER_ETH = 10n ** 18n;

interface Props {
  balance?: string;
  onSuccess?: () => void;
  to?: string;  
  value?: bigint;  
}

export default function Purchase(props: Props) {
  const { balance, onSuccess } = props;
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const [ispending, setIsPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleSendTransaction = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!evmAddress) return;

      e.preventDefault();
      setIsPending(true);

      const { transactionHash } = await sendEvmTransaction({
        transaction: {
          to: (props.to ?? evmAddress) as `0x${string}`, 
          value: BigInt(props?.value ?? 0) * WEI_PER_ETH,  // custom amount in eth
          gas: 21000n,                 // Standard ETH transfer gas limit
          chainId: 84532,              // Base Sepolia testnet
          type: "eip1559",             // Modern transaction type
        },
        evmAccount: evmAddress,
        network: "base-sepolia",
      });

      setTransactionHash(transactionHash);
      setIsPending(false);
      onSuccess?.();
    },
    [evmAddress, sendEvmTransaction, onSuccess],
  );

  // Component renders transaction button or success state
  return (
    <button onClick={handleSendTransaction}>
      Purchase item
    </button>
  );
}