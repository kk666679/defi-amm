'use client';
import { useEffect, useState } from 'react';
interface TocHeading { id: string; label: string; level: 2 | 3; }
const slugify = (text: string): string => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60) || 'section';

export default function DocsTOC() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  
  useEffect(() => {
    const scan = () => {
      const root = document.querySelector<HTMLElement>('[data-docs-content]');
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('h2, h3'));
      setHeadings(nodes.map((el) => { if (!el.id) el.id = slugify(el.textContent ?? ''); return { id: el.id, label: el.textContent?.trim() ?? '', level: el.tagName === 'H2' ? 2 : 3 }; }));
    };
    const t = window.setTimeout(scan, 0);
    const mo = new MutationObserver(scan);
    const watch = window.setInterval(() => { const root = document.querySelector('[data-docs-content]'); if (root) { mo.observe(root, { childList: true, subtree: true }); window.clearInterval(watch); } }, 50);
    return () => { window.clearTimeout(t); window.clearInterval(watch); mo.disconnect(); };
  }, []);

  useEffect(() => {
    if (!headings.length) return;
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveId(entry.target.id); }); }, { rootMargin: '0px 0px -80% 0px' });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;
  
  return (
    <aside className="w-[240px] border-l border-border hidden xl:block overflow-y-auto bg-background shrink-0 sidebar-scroll">
      <div className="p-6 sticky top-0">
        <h4 className="text-[13px] font-semibold text-foreground mb-4 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h7" /></svg>
          On this page
        </h4>
        <nav className="space-y-0.5 border-l border-border flex flex-col">
          {headings.map((h) => (
            <a key={h.id} href={`#${h.id}`} className={`toc-item block py-1.5 pr-2 text-[13px] border-l-2 -ml-px ${h.level === 2 ? 'pl-4' : 'pl-6'} ${activeId === h.id ? 'text-primary border-primary font-medium' : 'text-muted-foreground border-transparent hover:text-foreground'}`}>{h.label}</a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
