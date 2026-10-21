'use client';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
export interface AskQuestionBarHandle { focus: () => void; }
const AskQuestionBar = forwardRef<AskQuestionBarHandle>(function AskQuestionBar(_, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));
  const submit = () => { if (!value.trim()) return; setSent(value.trim()); setValue(''); window.setTimeout(() => setSent(null), 2400); };
  
  return (
    <div className="sticky bottom-0 pb-6 pt-10 bg-gradient-to-t from-background via-background to-transparent z-10 w-full pointer-events-none">
      <div className="max-w-[760px] mx-auto px-8 pointer-events-auto">
        <div className="relative bg-card border border-border rounded-2xl p-1.5 flex items-center shadow-lg">
          <input ref={inputRef} type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} placeholder="Ask a question..." className="flex-1 bg-transparent border-none outline-none text-[15px] text-foreground placeholder:text-muted-foreground px-4 py-2" />
          <button onClick={submit} aria-label="Send question" className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-primary transition-colors mr-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        </div>
        {sent && <div className="mt-2 text-[12px] text-primary text-center">Sent: “{sent}”</div>}
      </div>
    </div>
  );
});
export default AskQuestionBar;
