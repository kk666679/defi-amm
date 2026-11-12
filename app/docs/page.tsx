import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'PayFlow Docs · Overview', description: 'Build on the PayFlow network.' };

export default function AppKitOverviewPage() {
  return (
    <article data-docs-content className="prose prose-neutral dark:prose-invert max-w-none">
      
      {/* Hero Section */}
      <div className="mb-12 pb-8 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          v2.0 is now live
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
          Build the future of DeFi on PayFlow
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Everything you need to integrate seamless swaps, multi-wallet authentication, and smart accounts into your application.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-6">Quickstart</h2>
      
      <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">1. Install the SDK</h3>
      <div className="bg-muted p-4 rounded-xl border border-border font-mono text-sm text-foreground overflow-x-auto mb-6">
        npm install @payflow/sdk @wagmi/core viem
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-3 mt-8">2. Configure your App</h3>
      <div className="bg-muted p-4 rounded-xl border border-border font-mono text-sm text-foreground overflow-x-auto mb-6">
        <span className="text-primary">import</span> {'{'} createConfig {'}'} <span className="text-primary">from</span> <span className="text-emerald-500">&apos;@wagmi/core&apos;</span>;<br/>
        <span className="text-primary">import</span> {'{'} mainnet {'}'} <span className="text-primary">from</span> <span className="text-emerald-500">&apos;viem/chains&apos;</span>;<br/><br/>
        <span className="text-primary">export const</span> config = createConfig({'{'} <br/>
        &nbsp;&nbsp;chains: [mainnet],<br/>
        &nbsp;&nbsp;transports: {'{'} [mainnet.id]: http() {'}'},<br/>
        {'}'});
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-6 mt-12">Core Concepts</h2>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card">
          <h4 className="font-bold text-foreground mb-2">Accounts & Auth</h4>
          <p className="text-sm text-muted-foreground">Connect 600+ wallets via WalletConnect, or use email/social logins with embedded smart accounts.</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card">
          <h4 className="font-bold text-foreground mb-2">Instant Swaps</h4>
          <p className="text-sm text-muted-foreground">Execute 0.3% fee swaps across any liquidity pool on the PayFlow network with built-in routing.</p>
        </div>
      </div>

    </article>
  );
}
