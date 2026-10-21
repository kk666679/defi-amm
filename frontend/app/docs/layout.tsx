'use client';
import { useRef } from 'react';
import DocsHeader, { type DocsHeaderHandle } from './components/DocsHeader';
import DocsSidebar from './components/DocsSidebar';
import DocsTOC from './components/DocsTOC';
import AskQuestionBar, { type AskQuestionBarHandle } from './components/AskQuestionBar';
import './docs.css';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<DocsHeaderHandle>(null);
  const askRef = useRef<AskQuestionBarHandle>(null);
  
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden font-sans antialiased bg-background text-foreground z-50">
      <DocsHeader ref={headerRef} onAskAssistant={() => askRef.current?.focus()} />
      <div className="flex flex-1 overflow-hidden">
        <DocsSidebar />
        <main id="main-content" className="flex-1 overflow-y-auto relative docs-main bg-background">
          <div className="max-w-[760px] mx-auto px-8 py-12 md:py-16">{children}</div>
          <AskQuestionBar ref={askRef} />
        </main>
        <DocsTOC />
      </div>
    </div>
  );
}
