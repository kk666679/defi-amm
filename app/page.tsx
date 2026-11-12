import { SwapCard } from "@/components/SwapCard";
import { WalletBar } from "@/components/WalletBar";
import PayFlowLogo from "@/components/PayFlowLogo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0070BA]/10 to-transparent blur-3xl rounded-full -z-10" />

      {/* Master Navbar */}
      <header className="w-full border-b border-slate-200/50 bg-white/50 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <PayFlowLogo className="h-8 w-auto shrink-0" />
            <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block" />
            <span className="text-lg font-bold text-brand-dark tracking-tight hidden sm:block">DeFi AMM</span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-semibold min-w-0">
            <Link href="/wallet" className="text-brand-gray hover:text-brand-blue transition hidden sm:block shrink-0">
              Hybrid Wallet
            </Link>
            <Link href="/docs" className="text-brand-gray hover:text-brand-blue transition hidden sm:block shrink-0">
              Documentation
            </Link>
            <div className="shrink-0">
              <WalletBar />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Master Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-md flex flex-col items-center gap-8 mt-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-2">
              Master Protocol
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
              DeFi AMM
            </h1>
            <p className="text-brand-gray text-lg max-w-sm mx-auto">
              The core liquidity engine powering the PayFlow network.
            </p>
          </div>

          <SwapCard />
          
        </div>
      </main>
    </div>
  );
}
