export default function PayFlowLogo({ className = 'h-7 w-auto' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 230" className={className} role="img" aria-label="PayFlow">
      <defs>
        <linearGradient id="pf-iconGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#153D72" />
          <stop offset="1" stopColor="#11284F" />
        </linearGradient>
        <linearGradient id="pf-flowGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#56E0C1" />
          <stop offset="1" stopColor="#21B8A5" />
        </linearGradient>
      </defs>
      <rect x="224" y="10" width="112" height="112" rx="30" fill="url(#pf-iconGradient)" />
      <path d="M256 96V37h22c15 0 23 8 23 20s-8 20-23 20h-12v19h-10Zm10-29h12c9 0 13-3 13-10s-4-10-13-10h-12v20Z" fill="#FFFFFF" fillRule="evenodd" />
      <path d="M274 91c8 0 11 7 21 7h8" fill="none" stroke="url(#pf-flowGradient)" strokeWidth="6" strokeLinecap="round" />
      <path d="m300 93 7 5-7 5" fill="none" stroke="#56E0C1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="303" cy="32" r="7" fill="#F5C66A" />
      <text x="280" y="207" textAnchor="middle" fontFamily="Inter, Avenir, Montserrat, Arial, sans-serif" fontSize="66" fontWeight="700" letterSpacing="-2.5">
        <tspan fill="#15345E">Pay</tspan>
        <tspan fill="#22B59F">Flow</tspan>
      </text>
    </svg>
  );
}
