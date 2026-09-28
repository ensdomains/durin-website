"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useChains,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { isAddress, parseAbi, type Address } from "viem";
import toast from "react-hot-toast";
import { chainIdMap } from "@/lib/utils";

const REGISTRAR_ABI = parseAbi([
  "function register(string label, address owner) external",
]);

type Props = {
  registrarAddress: string;
  selectedChain: string;
  baseName?: string;
  isRegistrarConnected: boolean;
  addTransaction: (action: string, chain: string, hash: string) => void;
};

export default function MintSubdomainForm({
  registrarAddress,
  selectedChain,
  baseName,
  isRegistrarConnected,
  addTransaction,
}: Props) {
  const { address, chain, isConnected } = useAccount();
  const chains = useChains();
  const { switchChain, error: switchError } = useSwitchChain();
  const { writeContract, data: hash, error: writeError, isPending } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });
  const [label, setLabel] = useState("");
  const [recipient, setRecipient] = useState("");
  const [pendingSwitch, setPendingSwitch] = useState(false);
  const targetChainId = chainIdMap[selectedChain];
  const normalizedLabel = label.trim().toLowerCase();
  const fullName = useMemo(
    () =>
      normalizedLabel && baseName
        ? `${normalizedLabel}.${baseName}`
        : baseName || "your ENS name",
    [baseName, normalizedLabel]
  );

  useEffect(() => {
    if (address) setRecipient(address);
  }, [address]);

  const mint = useCallback(() => {
    if (!isConnected) return toast.error("Connect your wallet first");
    if (!isRegistrarConnected) {
      return toast.error("Connect the registrar to the registry first");
    }
    if (!isAddress(registrarAddress)) {
      return toast.error("Deploy the registrar first");
    }
    if (Array.from(normalizedLabel).length < 3) {
      return toast.error("Use a label with at least 3 characters");
    }
    if (normalizedLabel.includes(".") || /\s/.test(normalizedLabel)) {
      return toast.error("Enter a single label without dots or spaces");
    }
    if (!isAddress(recipient)) {
      return toast.error("Enter a valid recipient address");
    }

    writeContract({
      address: registrarAddress as Address,
      abi: REGISTRAR_ABI,
      functionName: "register",
      args: [normalizedLabel, recipient],
      chainId: targetChainId,
    });
  }, [
    isConnected,
    isRegistrarConnected,
    normalizedLabel,
    recipient,
    registrarAddress,
    targetChainId,
    writeContract,
  ]);

  useEffect(() => {
    if (pendingSwitch && chain?.id === targetChainId) {
      setPendingSwitch(false);
      mint();
    }
  }, [chain?.id, mint, pendingSwitch, targetChainId]);

  useEffect(() => {
    if (switchError || writeError) {
      setPendingSwitch(false);
      toast.error(
        switchError ? "Network switch cancelled" : "Mint transaction rejected"
      );
    }
  }, [switchError, writeError]);

  useEffect(() => {
    if (!isSuccess || !hash) return;
    addTransaction(`Minted ${fullName}`, selectedChain, hash);
    toast.success(`${fullName} minted`);
  }, [addTransaction, fullName, hash, isSuccess, selectedChain]);

  const handleMint = () => {
    if (chain?.id !== targetChainId) {
      if (!chains.some((item) => item.id === targetChainId)) {
        return toast.error("Selected chain is not configured");
      }
      setPendingSwitch(true);
      switchChain({ chainId: targetChainId });
      return;
    }
    mint();
  };

  const buttonLabel = pendingSwitch
    ? "Switching network…"
    : isPending
    ? "Confirm in wallet…"
    : isConfirming
    ? "Minting…"
    : isSuccess
    ? "Subdomain minted ✓"
    : `Mint ${fullName}`;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm text-stone-700">
        Subdomain label
        <div className="flex items-center overflow-hidden border border-stone-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-stone-200">
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="alice"
            disabled={isPending || isConfirming || isSuccess}
            className="min-w-0 flex-1 h-10 px-3 outline-none disabled:bg-stone-100"
          />
          <span className="max-w-[50%] px-3 text-stone-400 truncate border-l border-stone-200">
            .{baseName || "example.eth"}
          </span>
        </div>
      </label>

      <label className="flex flex-col gap-2 text-sm text-stone-700">
        Recipient address
        <input
          type="text"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="0x…"
          disabled={isPending || isConfirming || isSuccess}
          className="h-10 px-3 font-mono text-sm border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-stone-200 disabled:bg-stone-100"
        />
      </label>

      <button
        type="button"
        onClick={handleMint}
        disabled={
          !isRegistrarConnected ||
          !normalizedLabel ||
          !recipient ||
          pendingSwitch ||
          isPending ||
          isConfirming ||
          isSuccess
        }
        className="h-10 w-fit px-4 text-sm font-medium border border-stone-900 rounded-lg bg-stone-900 text-white hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-500 disabled:border-stone-200 disabled:cursor-not-allowed"
      >
        {buttonLabel}
      </button>
      {!isRegistrarConnected && (
        <p className="text-sm text-stone-500">
          Complete step 4 before minting a subdomain.
        </p>
      )}
    </div>
  );
}
