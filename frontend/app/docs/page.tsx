import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeFi AMM Docs · AppKit Overview',
  description: 'The Reown SDK (AppKit) — accounts, authentication, payments solutions.',
};

export default function AppKitOverviewPage() {
  return (
    <article data-docs-content>
      <h2 className="text-[22px] font-bold text-white mb-6 tracking-tight">The Reown SDK (AppKit) includes:</h2>

      <h3 className="text-[18px] font-bold text-white mb-4 mt-8">Accounts & Authentication</h3>
      <ul className="space-y-3 mb-10 pl-1 list-none">
        <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#555] shrink-0" /><span className="text-[#A3A3A3] text-[15px] leading-relaxed">Connections to 600+ wallets via the WalletConnect Network (SIWE)</span></li>
        <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#555] shrink-0" /><a href="#" className="text-gb-green hover:text-gb-greenHover text-[15px] font-semibold underline decoration-gb-green/30 underline-offset-4 transition-colors leading-relaxed">Multichain authentication (SIWX)</a></li>
        <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#555] shrink-0" /><a href="#" className="text-gb-green hover:text-gb-greenHover text-[15px] font-semibold underline decoration-gb-green/30 underline-offset-4 transition-colors leading-relaxed">Email & social logins</a></li>
        <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#555] shrink-0" /><a href="#" className="text-gb-green hover:text-gb-greenHover text-[15px] font-semibold underline decoration-gb-green/30 underline-offset-4 transition-colors leading-relaxed">Smart Accounts</a></li>
        <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#555] shrink-0" /><a href="#" className="text-gb-green hover:text-gb-greenHover text-[15px] font-semibold underline decoration-gb-green/30 underline-offset-4 transition-colors leading-relaxed">Multiwallet Linking</a></li>
      </ul>

      <h3 className="text-[18px] font-bold text-white mb-4 mt-8">Payments Solutions</h3>
      <ul className="space-y-3 mb-10 pl-1 list-none">
        <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#555] shrink-0" /><a href="#" className="text-gb-green hover:text-gb-greenHover text-[15px] font-semibold underline decoration-gb-green/30 underline-offset-4 transition-colors leading-relaxed">In-platform Swap feature</a></li>
        <li className="flex items-start gap-3"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#555] shrink-0" /><a href="#" className="text-gb-green hover:text-gb-greenHover text-[15px] font-semibold underline decoration-gb-green/30 underline-offset-4 transition-colors leading-relaxed">In-platform Onramps</a></li>
      </ul>
    </article>
  );
}
