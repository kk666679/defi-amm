"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { parseEther, type Address, type Hash } from "viem";
import { useAccount, useConnect, usePublicClient, useSwitchChain, useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AMM_ABI, AMM_DEPLOYMENT_ABI, ERC20_ABI, TOKEN_DEPLOYMENT_ABI } from "@/lib/abi";
import { SIMPLE_AMM_BYTECODE, TOKEN_A_BYTECODE, TOKEN_B_BYTECODE } from "@/lib/deployment-bytecode";
import { SEPOLIA_CHAIN_ID, type CompleteContractAddresses } from "@/lib/constants";
import { useContractAddresses } from "@/lib/contract-addresses";
import { isWalletProviderMissing } from "@/lib/wallet-errors";

const INITIAL_LIQUIDITY = parseEther("10000");

export function DeploySepoliaContracts() {
  const { address, chainId: walletChainId, isConnected } = useAccount();
  const { connect, connectors, error: connectError, isPending: isConnecting } = useConnect();
  const { switchChain, error: switchError, isPending: isSwitching } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ chainId: SEPOLIA_CHAIN_ID });
  const queryClient = useQueryClient();
  const {
    addresses,
    chainId,
    configured,
    isSessionDeployment,
    poolSeeded,
    setDeployedAddresses,
    markPoolSeeded,
  } = useContractAddresses();
  const [draftAddresses, setDraftAddresses] = useState<Partial<CompleteContractAddresses>>({});
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const injectedConnector = connectors.find((connector) => connector.id === "injected");
  const readyForSepolia = isConnected && walletChainId === SEPOLIA_CHAIN_ID;
  const providerMissing = isWalletProviderMissing(connectError ?? switchError ?? error);
  const openPreviewInNewTab = () => window.open(window.location.href, "_blank", "noopener,noreferrer");
  const connectionErrorMessage = error || (providerMissing
    ? "No injected wallet was found in this tab. Enable your wallet extension, or open the preview in a new tab and try again."
    : "Wallet connection or network switching failed.");
  const shouldShow = chainId === SEPOLIA_CHAIN_ID && (!configured || isSessionDeployment);

  if (!shouldShow) return null;

  const waitForTransaction = async (hash: Hash, label: string) => {
    if (!publicClient) throw new Error("Sepolia RPC is unavailable.");
    setStatus(`Waiting for ${label} confirmation on Sepolia…`);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") throw new Error(`${label} was reverted.`);
    return receipt;
  };

  const handleDeployContracts = async () => {
    if (!walletClient || !publicClient || !address || !readyForSepolia) return;
    setIsDeploying(true);
    setError("");
    setStatus("Deploying Token A. Confirm the transaction in your wallet.");

    try {
      let tokenA = draftAddresses.tokenA;
      if (!tokenA) {
        const hash = await walletClient.deployContract({ account: address, abi: TOKEN_DEPLOYMENT_ABI, bytecode: TOKEN_A_BYTECODE });
        const receipt = await waitForTransaction(hash, "Token A deployment");
        if (!receipt.contractAddress) throw new Error("Token A deployment returned no contract address.");
        tokenA = receipt.contractAddress;
        setDraftAddresses((current) => ({ ...current, tokenA }));
      }

      let tokenB = draftAddresses.tokenB;
      if (!tokenB) {
        setStatus("Deploying Token B. Confirm the transaction in your wallet.");
        const hash = await walletClient.deployContract({ account: address, abi: TOKEN_DEPLOYMENT_ABI, bytecode: TOKEN_B_BYTECODE });
        const receipt = await waitForTransaction(hash, "Token B deployment");
        if (!receipt.contractAddress) throw new Error("Token B deployment returned no contract address.");
        tokenB = receipt.contractAddress;
        setDraftAddresses((current) => ({ ...current, tokenB }));
      }

      let amm = draftAddresses.amm;
      if (!amm) {
        setStatus("Deploying the AMM. Confirm the transaction in your wallet.");
        const hash = await walletClient.deployContract({
          account: address,
          abi: AMM_DEPLOYMENT_ABI,
          bytecode: SIMPLE_AMM_BYTECODE,
          args: [tokenA, tokenB],
        });
        const receipt = await waitForTransaction(hash, "AMM deployment");
        if (!receipt.contractAddress) throw new Error("AMM deployment returned no contract address.");
        amm = receipt.contractAddress;
        setDraftAddresses((current) => ({ ...current, amm }));
      }

      const deployed = { amm, tokenA, tokenB };
      setDeployedAddresses(SEPOLIA_CHAIN_ID, deployed);
      setStatus("Contracts deployed. Approve both tokens and seed the initial pool next.");
      await queryClient.invalidateQueries();
    } catch (deployError) {
      setError(deployError instanceof Error ? deployError.message : "Contract deployment failed.");
      setStatus("");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSeedPool = async () => {
    if (!walletClient || !publicClient || !address || !readyForSepolia || !configured) return;
    setIsSeeding(true);
    setError("");
    setStatus("Approving Token A. Confirm the transaction in your wallet.");

    try {
      const allowanceA = await publicClient.readContract({
        address: addresses.tokenA!,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, addresses.amm!],
      });
      if (allowanceA < INITIAL_LIQUIDITY) {
        const hash = await walletClient.writeContract({
          account: address,
          address: addresses.tokenA!,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [addresses.amm!, INITIAL_LIQUIDITY],
        });
        await waitForTransaction(hash, "Token A approval");
      }

      const allowanceB = await publicClient.readContract({
        address: addresses.tokenB!,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, addresses.amm!],
      });
      if (allowanceB < INITIAL_LIQUIDITY) {
        setStatus("Approving Token B. Confirm the transaction in your wallet.");
        const hash = await walletClient.writeContract({
          account: address,
          address: addresses.tokenB!,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [addresses.amm!, INITIAL_LIQUIDITY],
        });
        await waitForTransaction(hash, "Token B approval");
      }

      setStatus("Adding 10,000 TKA and 10,000 TKB to the pool. Confirm the transaction in your wallet.");
      const hash = await walletClient.writeContract({
        account: address,
        address: addresses.amm!,
        abi: AMM_ABI,
        functionName: "addLiquidity",
        args: [INITIAL_LIQUIDITY, INITIAL_LIQUIDITY],
      });
      await waitForTransaction(hash, "Initial liquidity");
      markPoolSeeded(SEPOLIA_CHAIN_ID);
      setStatus("Sepolia pool seeded with 10,000 TKA and 10,000 TKB.");
      await queryClient.invalidateQueries();
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : "Initial liquidity setup failed.");
      setStatus("");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopyEnvironment = async () => {
    if (!addresses.amm || !addresses.tokenA || !addresses.tokenB) return;
    const environment = [
      `NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS=${addresses.amm}`,
      `NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS=${addresses.tokenA}`,
      `NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS=${addresses.tokenB}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(environment);
      setCopyStatus("Address variables copied. Add them to Vercel Vars to keep this deployment after a refresh.");
    } catch {
      setCopyStatus("Clipboard access is unavailable. Copy the address values shown below into Vercel Vars.");
    }
  };

  const shortAddress = (value: Address) => `${value.slice(0, 8)}…${value.slice(-6)}`;

  return (
    <Card className="mb-6 border-border/60 bg-background/90 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-lg">
          <span>Sepolia testnet setup</span>
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Wallet-signed</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Deploy TKA, TKB, and the AMM from your connected wallet, then seed a 10,000 / 10,000 pool. This uses six Sepolia transactions and requires Sepolia test ETH; no private keys are requested.
        </p>
        {!isConnected && (
          <Button disabled={isConnecting || !injectedConnector} onClick={() => injectedConnector && connect({ connector: injectedConnector })}>
            {isConnecting ? "Connecting wallet…" : injectedConnector ? "Connect injected wallet" : "No injected wallet detected"}
          </Button>
        )}
        {isConnected && !readyForSepolia && (
          <Button disabled={isSwitching} onClick={() => switchChain({ chainId: SEPOLIA_CHAIN_ID })}>
            {isSwitching ? "Switching to Sepolia…" : "Switch wallet to Sepolia"}
          </Button>
        )}
        {isConnected && !configured && (
          <Button disabled={!readyForSepolia || !walletClient || !publicClient || isDeploying} onClick={handleDeployContracts}>
            {isDeploying ? "Deploying contracts…" : Object.keys(draftAddresses).length ? "Resume contract deployment" : "Deploy TKA, TKB, and AMM"}
          </Button>
        )}
        {isSessionDeployment && configured && !poolSeeded && (
          <Button disabled={!readyForSepolia || !walletClient || !publicClient || isSeeding} onClick={handleSeedPool}>
            {isSeeding ? "Preparing initial pool…" : "Approve tokens and seed pool"}
          </Button>
        )}
        {poolSeeded && <p role="status" className="text-sm font-medium text-primary">Initial Sepolia pool is ready for trading.</p>}
        {status && <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{status}</p>}
        {(connectError || switchError || error) && (
          <div className="flex flex-col gap-2 text-sm text-destructive">
            <p role="alert">{connectionErrorMessage}</p>
            {providerMissing && (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={openPreviewInNewTab}>
                Open preview in a new tab
              </Button>
            )}
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer">Technical details</summary>
              <p className="mt-1 break-words">{error || (connectError ?? switchError)?.message}</p>
            </details>
          </div>
        )}
        {Object.keys(draftAddresses).length > 0 && !configured && (
          <dl className="grid gap-2 rounded-lg border border-border p-3 text-xs">
            {draftAddresses.tokenA && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">TKA deployed</dt><dd className="font-mono">{shortAddress(draftAddresses.tokenA)}</dd></div>}
            {draftAddresses.tokenB && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">TKB deployed</dt><dd className="font-mono">{shortAddress(draftAddresses.tokenB)}</dd></div>}
            {draftAddresses.amm && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">AMM deployed</dt><dd className="font-mono">{shortAddress(draftAddresses.amm)}</dd></div>}
          </dl>
        )}
        {isSessionDeployment && configured && (
          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <dl className="grid gap-2 text-xs">
              <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">AMM</dt><dd><a className="font-mono underline underline-offset-2" href={`https://sepolia.etherscan.io/address/${addresses.amm}`} target="_blank" rel="noreferrer" aria-label={`View AMM ${addresses.amm} on Sepolia Etherscan`}>{shortAddress(addresses.amm!)}</a></dd></div>
              <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">TKA</dt><dd><a className="font-mono underline underline-offset-2" href={`https://sepolia.etherscan.io/address/${addresses.tokenA}`} target="_blank" rel="noreferrer" aria-label={`View TKA ${addresses.tokenA} on Sepolia Etherscan`}>{shortAddress(addresses.tokenA!)}</a></dd></div>
              <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">TKB</dt><dd><a className="font-mono underline underline-offset-2" href={`https://sepolia.etherscan.io/address/${addresses.tokenB}`} target="_blank" rel="noreferrer" aria-label={`View TKB ${addresses.tokenB} on Sepolia Etherscan`}>{shortAddress(addresses.tokenB!)}</a></dd></div>
            </dl>
            <Button size="sm" variant="outline" onClick={handleCopyEnvironment}>Copy address variables</Button>
            {copyStatus && <p role="status" aria-live="polite" className="text-xs text-muted-foreground">{copyStatus}</p>}
            <p className="text-xs text-muted-foreground">Session addresses reset on refresh. Copy them into the corresponding Vercel Vars to reuse this deployment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
