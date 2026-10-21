'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function WalletHome() {
  const [tab, setTab] = useState<'crypto' | 'fiat'>('crypto');

  const cryptoAssets = [
    { name: 'Ethereum', type: 'ETH', balance: '1.2081 ETH', value: '$3,432.19', icon: 'Ξ', iconClass: 'eth', valueColor: 'text-brand-green', trend: '+2.1%' },
    { name: 'USD Coin', type: 'USDC', balance: '2,104.20 USDC', value: '$2,104.20', icon: '$', iconClass: 'usdc', valueColor: 'text-brand-green', trend: '+0.01%' },
    { name: 'Wrapped BTC', type: 'WBTC', balance: '0.0412 WBTC', value: '$2,840.00', icon: '₿', iconClass: 'wbtc', valueColor: 'text-brand-red', trend: '-1.2%' },
  ];

  const fiatAssets = [
    { name: 'PayPal Balance', type: 'USD Wallet', balance: '$450.00', value: '≈ RM 2,115.00', icon: 'P', iconClass: 'paypal', tag: 'Linked', tagColor: 'bg-brand-lightBlue text-brand-blue' },
    { name: 'TNG eWallet', type: 'MYR Wallet', balance: 'RM 1,200.00', value: 'Available', icon: 'T', iconClass: 'bg-[#0057B8]', tag: 'Linked', tagColor: 'bg-brand-tngLight text-brand-tngBlue' },
  ];

  const assets = tab === 'crypto' ? cryptoAssets : fiatAssets;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Balance Card */}
      <div className="bg-gradient-to-br from-brand-darkBlue to-brand-blue rounded-2xl p-6 text-white shadow-[0_8px_24px_rgba(0,112,186,0.2)] mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[12px] text-blue-100 font-medium mb-1 uppercase tracking-wider">Total Balance</div>
              <div className="text-[34px] font-bold tracking-tight mb-1">RM 18,450.00</div>
              <div className="text-[13px] text-blue-100 flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                  +2.4%
                </span>
                <span>vs last month</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
              <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Linked</div>
              <div className="text-[12px] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span> Both
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Link href="/wallet/swap" className="flex-1 bg-white text-brand-darkBlue font-semibold text-[13px] py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-1.5 active:scale-95">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4l4 4"/><path d="M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
              Swap
            </Link>
            <Link href="/wallet/pools" className="flex-1 bg-brand-yellow text-brand-darkBlue font-semibold text-[13px] py-2.5 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-1.5 active:scale-95">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Earn
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Top Up', icon: <path d="M12 5v14M5 12h14"/> },
          { label: 'Send', icon: <path d="M19 12H5M12 19l-7-7 7-7"/> },
          { label: 'Request', icon: <path d="M7 17l9.2-9.2M17 17V7H7"/> },
          { label: 'Pay', icon: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></> }
        ].map((item) => (
          <button key={item.label} className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition active:scale-95">
            <div className="w-10 h-10 rounded-full bg-brand-lightBlue flex items-center justify-center text-brand-blue">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">{item.icon}</svg>
            </div>
            <span className="text-[11px] font-medium text-brand-gray">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Segmented Control */}
      <div className="flex items-center bg-gray-100 rounded-xl p-1 mb-4">
        <button onClick={() => setTab('crypto')} className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all ${tab === 'crypto' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-gray hover:text-brand-dark'}`}>Crypto</button>
        <button onClick={() => setTab('fiat')} className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all ${tab === 'fiat' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-gray hover:text-brand-dark'}`}>Fiat</button>
      </div>

      {/* Assets List */}
      <div className="space-y-3">
        {assets.map((asset, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-black/[0.03] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-brand-blue/20 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`asset-icon ${asset.iconClass}`}>{asset.icon}</div>
              <div>
                <div className="text-[14px] font-bold text-brand-dark flex items-center gap-1.5">
                  {asset.name}
                  {'tag' in asset && asset.tag && <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${asset.tagColor}`}>{asset.tag}</span>}
                </div>
                <div className="text-[12px] text-brand-gray">{asset.type}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-bold text-brand-dark">{asset.balance}</div>
              <div className={`text-[12px] flex items-center justify-end gap-1 ${asset.valueColor || 'text-brand-gray'}`}>
                {'trend' in asset && asset.trend}
                {asset.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
