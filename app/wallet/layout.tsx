'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletBar } from '@/components/WalletBar';
import { DeploySepoliaContracts } from '@/components/DeploySepoliaContracts';

const navItems = [
  {
    name: 'Home',
    path: '/wallet',
    icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  },
  {
    name: 'Swap',
    path: '/wallet/swap',
    icon: (
      <>
        <path d="M7 16V4M7 4L3 8M7 4l4 4" />
        <path d="M17 8v12M17 20l4-4M17 20l-4-4" />
      </>
    ),
  },
  {
    name: 'Earn',
    path: '/wallet/pools',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  },
  {
    name: 'PayFlow',
    path: '/payflow',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
];

function NavLink({ item, pathname }: { item: (typeof navItems)[number]; pathname: string }) {
  const isActive = pathname === item.path;
  return (
    <Link
      href={item.path}
      className={`flex flex-col items-center gap-1 w-16 transition-colors ${
        isActive ? 'text-brand-blue' : 'text-brand-gray hover:text-brand-dark'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-5 h-5 transition-transform ${isActive ? 'stroke-brand-blue scale-110' : 'stroke-current'}`}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {item.icon}
      </svg>
      <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
    </Link>
  );
}

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] bg-brand-bg font-sans text-brand-dark selection:bg-brand-blue/20 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/wallet" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-brand-darkBlue flex items-center justify-center text-white font-bold text-sm relative">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M4 12h10M4 17h6" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green rounded-full border-2 border-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[11px] text-brand-gray font-medium">Your wallet</div>
              <div className="text-[14px] font-bold text-brand-dark leading-tight">PayFlow</div>
            </div>
          </Link>

          {/* Desktop inline nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Wallet navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-lightBlue text-brand-blue'
                      : 'text-brand-gray hover:text-brand-dark hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 min-w-0">
            <WalletBar />
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-semibold text-brand-blue bg-brand-lightBlue px-3 py-1.5 rounded-lg hover:bg-blue-100 transition shrink-0"
            >
              Back to AMM
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <DeploySepoliaContracts />
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav
        aria-label="Wallet navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex items-center justify-around h-16 px-2 max-w-2xl mx-auto">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} pathname={pathname} />
          ))}
        </div>
      </nav>
    </div>
  );
}
