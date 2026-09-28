"use client";

import { useCallback, useEffect, useState } from "react";
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

const REGISTRY_ABI = parseAbi(["function addRegistrar(address registrar) external"]);

type Props = {
  registryAddress: string;
  registrarAddress: string;
  selectedChain: string;
  addTransaction: (action: string, chain: string, hash: string) => void;
};

export default function ConnectRegistrarButton({
  registryAddress,
  registrarAddress,
  selectedChain,
  addTransaction,
}: Props) {
  const [pendingSwitch, setPendingSwitch] = useState(false);
  const { chain, isConnected } = useAccount();
  const chains = useChains();
  const { switchChain, error: switchError } = useSwitchChain();
  const { writeContract, data: hash, error: writeError, isPending } =
    useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });
  const targetChainId = chainIdMap[selectedChain];

  const connect = useCallback(() => {
    if (!isConnected) return toast.error("Connect your wallet first");
    if (!isAddress(registryAddress) || !isAddress(registrarAddress)) {
      return toast.error("Deploy the registry and registrar first");
    }
    writeContract({
      address: registryAddress as Address,
      abi: REGISTRY_ABI,
      functionName: "addRegistrar",
      args: [registrarAddress as Address],
      chainId: targetChainId,
    });
  }, [
    isConnected,
    registrarAddress,
    registryAddress,
    targetChainId,
    writeContract,
  ]);

  useEffect(() => {
    if (pendingSwitch && chain?.id === targetChainId) {
      setPendingSwitch(false);
      connect();
    }
  }, [chain?.id, pendingSwitch, targetChainId, connect]);

  useEffect(() => {
    if (switchError || writeError) {
      setPendingSwitch(false);
      toast.error(
        switchError
          ? "Network switch cancelled"
          : "Connection transaction rejected"
      );
    }
  }, [switchError, writeError]);

  useEffect(() => {
    if (!isSuccess || !hash) return;
    addTransaction("Connected Registrar", selectedChain, hash);
    toast.success("Registrar connected to registry");
  }, [isSuccess, hash, addTransaction, selectedChain]);

  const handleConnect = () => {
    if (!isAddress(registryAddress) || !isAddress(registrarAddress)) {
      return toast.error("Deploy the registry and registrar first");
    }
    if (chain?.id !== targetChainId) {
      if (!chains.some((item) => item.id === targetChainId)) {
        return toast.error("Selected chain is not configured");
      }
      setPendingSwitch(true);
      switchChain({ chainId: targetChainId });
      return;
    }
    connect();
  };

  const label = pendingSwitch
    ? "Switching network…"
    : isPending
    ? "Confirm in wallet…"
    : isConfirming
    ? "Connecting…"
    : isSuccess
    ? "Registrar connected ✓"
    : "Connect registrar";

  return (
    <button
      onClick={handleConnect}
      disabled={pendingSwitch || isPending || isConfirming || isSuccess}
      className="h-10 px-4 text-sm font-medium border border-stone-900 rounded-lg bg-stone-900 text-white hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-500 disabled:border-stone-200 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
