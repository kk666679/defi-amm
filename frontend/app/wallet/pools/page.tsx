import Link from 'next/link';

export default function PoolsPage() {
  const pools = [
    { pair: 'ETH / USDC', fee: '0.05% Fee Tier', apr: '16.8% APR', tvl: '$612.4M TVL', icon1: 'eth', icon2: 'usdc', t1: 'Ξ', t2: '$' },
    { pair: 'USDC / DAI', fee: '0.01% Fee Tier', apr: '6.2% APR', tvl: '$248.7M TVL', icon1: 'usdc', icon2: 'dai', t1: '$', t2: '◈' },
    { pair: 'WBTC / ETH', fee: '0.30% Fee Tier', apr: '12.4% APR', tvl: '$384.1M TVL', icon1: 'wbtc', icon2: 'eth', t1: '₿', t2: 'Ξ' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-6">
        <Link href="/wallet" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gray shadow-sm mr-3 hover:text-brand-dark transition">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <h1 className="text-[18px] font-bold text-brand-dark">Earn</h1>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-brand-darkBlue to-brand-blue rounded-2xl p-5 text-white mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 transform skew-x-12"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1 text-brand-yellow">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Featured Pool
          </div>
          <div className="text-[20px] font-bold mb-1">ETH / USDC</div>
          <div className="text-[13px] text-blue-100 mb-3">Earn up to 16.8% APR on your liquidity.</div>
          <button className="bg-white text-brand-darkBlue text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition shadow-sm active:scale-95">Provide Liquidity</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-brand-dark">All Pools</h2>
        <span className="text-[12px] text-brand-gray font-medium">{pools.length} active</span>
      </div>

      <div className="space-y-3">
        {pools.map((pool, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-black/[0.03] shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-brand-blue/30 transition">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className={`asset-icon ${pool.icon1} ring-2 ring-white !w-9 !h-9`}>{pool.t1}</div>
                  <div className={`asset-icon ${pool.icon2} ring-2 ring-white !w-9 !h-9`}>{pool.t2}</div>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-brand-dark">{pool.pair}</div>
                  <div className="text-[12px] text-brand-gray">{pool.fee}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold text-brand-green">{pool.apr}</div>
                <div className="text-[12px] text-brand-gray">{pool.tvl}</div>
              </div>
            </div>
            <button className="bg-brand-lightBlue text-brand-blue w-full py-2.5 rounded-xl text-[13px] font-semibold hover:bg-blue-100 transition active:scale-[0.98]">Deposit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
