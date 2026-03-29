import { useEffect, useRef } from 'react';
import cherreLogo from '@/assets/cherre-logo.jpeg';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const barcodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bc = barcodeRef.current;
    if (!bc || bc.childNodes.length > 0) return;
    const heights = [32, 20, 40, 28, 36, 18, 44, 24, 38, 22, 30, 42, 16, 34, 26, 40, 20, 36, 28, 44, 18, 32, 24, 38, 22];
    heights.forEach(h => {
      const span = document.createElement('span');
      span.style.height = h + 'px';
      span.style.display = 'block';
      span.style.background = 'hsl(var(--foreground))';
      span.style.width = '2px';
      bc.appendChild(span);
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center p-10" style={{ position: 'absolute', inset: 0 }}>
      {/* Logo Mark */}
      <svg className="w-14 h-14 mb-5" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="27" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="22" r="7" fill="hsl(var(--primary))" />
        <circle cx="36" cy="22" r="7" fill="hsl(var(--primary-light))" />
        <ellipse cx="28" cy="36" rx="10" ry="7" fill="hsl(var(--primary))" opacity="0.6" />
      </svg>

      <div className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase mb-7">
        Price Check on Aisle F
      </div>

      <div className="text-foreground font-black leading-none tracking-tight mb-2" style={{ fontSize: 'clamp(38px, 7vw, 72px)' }}>
        Cherre<br /><span className="text-primary">Data Mart</span>
      </div>

      <div className="text-muted-foreground font-normal mb-12 tracking-wide" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
        Scan, search, or look up your item to begin checkout.
      </div>

      <div className="text-[12px] text-foreground/20 italic font-light mb-13 max-w-[360px] leading-relaxed border border-foreground/[0.06] rounded-lg px-5 py-3.5 mb-12">
        "This store has been running on four different inventory systems since 2003. Good luck."
      </div>

      <button
        onClick={onStart}
        className="bg-primary text-primary-foreground border-none rounded px-13 py-4.5 font-sans text-sm font-bold tracking-[0.12em] uppercase cursor-pointer transition-all hover:bg-primary-light active:scale-[0.98]"
      >
        Start Lookup
      </button>

      <div
        ref={barcodeRef}
        className="mt-12 flex gap-0.5 justify-center items-end opacity-[0.12]"
        aria-hidden="true"
      />
    </div>
  );
};

export default WelcomeScreen;
