'use client';

import { NAV_SECTIONS, QUICK_LINKS } from '../docs-nav';

export default function DocsSidebar() {
  return (
    <aside className="w-[280px] bg-gb-sidebar border-r border-gb-border flex-col overflow-y-auto shrink-0 hidden md:flex sidebar-scroll">
      <div className="p-5 flex-1">
        <button className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gb-border hover:border-[#4A5060] bg-[#1E212B] transition-colors group mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gb-green/10 flex items-center justify-center text-gb-green">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">AppKit - Overview</span>
          </div>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gb-muted group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <div className="space-y-0.5 mb-6">
          {QUICK_LINKS.map((q) => (
            <a key={q.label} href={q.href} className="flex items-center gap-3 px-2.5 py-1.5 text-[13px] font-medium text-gb-muted hover:text-white hover:bg-gb-hover rounded-md transition-colors group">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#666] group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2}>
                {q.label === 'Report an Issue' ? (
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </>
                )}
              </svg>
              {q.label}
            </a>
          ))}
        </div>
        <div className="h-px bg-gb-border mb-6" />
        {NAV_SECTIONS.map((section) => (
          <div className="mb-6" key={section.heading}>
            <h4 className="px-2.5 text-[11px] font-bold text-white uppercase tracking-wider mb-2">{section.heading}</h4>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <a key={item.label} href={item.href} className="flex items-center justify-between px-2.5 py-1.5 text-[13px] text-gb-muted hover:text-white hover:bg-gb-hover rounded-md transition-colors">
                  {item.label}
                  {item.hasChevron && (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
