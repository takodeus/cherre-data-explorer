import { useEffect, useRef, useState } from 'react';
import cherreLogo from '@/assets/cherre-logo.jpeg';

interface WelcomeScreenProps {
  onStart: () => void;
}

const IDLE_DELAY = 8000;
const BAR_HEIGHTS = [32, 20, 40, 28, 36, 18, 44, 24, 38, 22, 30, 42, 16, 34, 26, 40, 20, 36, 28, 44, 18, 32, 24, 38, 22];

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const barcodeRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [idle, setIdle] = useState(false);

  // Build barcode bars once, with staggered animation-delay stored as data attr
  useEffect(() => {
    const bc = barcodeRef.current;
    if (!bc || bc.childNodes.length > 0) return;
    BAR_HEIGHTS.forEach((h, i) => {
      const span = document.createElement('span');
      span.style.height = h + 'px';
      span.style.display = 'block';
      span.style.background = 'hsl(var(--foreground))';
      span.style.width = '2px';
      // Stagger: sweep from left to right over ~1s, then loop
      const delay = (i / BAR_HEIGHTS.length) * 1.6;
      span.style.animationDelay = `${delay.toFixed(2)}s`;
      bc.appendChild(span);
    });
  }, []);

  // Idle timer — reset on any interaction
  const resetTimer = () => {
    setIdle(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIdle(true), IDLE_DELAY);
  };

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    // Start the timer immediately when screen mounts
    timerRef.current = setTimeout(() => setIdle(true), IDLE_DELAY);
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStart = () => {
    resetTimer();
    onStart();
  };

  return (
    <div
      className="flex flex-col justify-center items-center text-center retro-dot-grid"
      style={{ position: 'absolute', inset: 0, padding: '40px' }}
    >
      {/* Retro top stripe */}
      <div className="retro-stripe-top absolute top-0 left-0 right-0" />

      {/* Logo */}
      <img src={cherreLogo} alt="Cherre" className="h-14 mb-6 object-contain" />

      {/* Retro tag */}
      <div className="price-tag text-[10px] font-bold tracking-[0.22em] uppercase mb-8">
        Price Check on Aisle F
      </div>

      <div className="text-foreground font-black leading-none tracking-tight mb-3" style={{ fontSize: 'clamp(38px, 7vw, 72px)' }}>
        Cherre<br /><span className="text-primary">Data Mart</span>
      </div>

      <div className="text-muted-foreground font-normal mb-8 tracking-wide max-w-[400px]" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
        Scan, search, or look up your item to begin checkout.
      </div>

      <div className="text-[12px] text-foreground/40 italic font-light max-w-[380px] leading-relaxed border-2 border-dashed border-border rounded-none px-6 py-4 mb-10 bg-card/60">
        "This store has been running on four different inventory systems since 2003. Good luck."
      </div>

      <button
        onClick={handleStart}
        className={`bg-primary text-primary-foreground border-none rounded-none px-14 py-5 font-sans text-sm font-bold tracking-[0.14em] uppercase cursor-pointer transition-colors hover:bg-primary-light active:scale-[0.98] shadow-[4px_4px_0_hsl(var(--foreground))] ${idle ? 'idle-btn' : ''}`}
      >
        Start Lookup
      </button>

      {/* Idle nudge label — fades in after button, fades out on activity */}
      <div
        className="mt-3 font-mono text-[9px] tracking-[0.18em] uppercase text-primary/60 transition-opacity duration-700"
        style={{ opacity: idle ? 1 : 0 }}
        aria-hidden="true"
      >
        Tap to begin ↑
      </div>

      <div
        ref={barcodeRef}
        className={`mt-8 flex gap-0.5 justify-center items-end transition-opacity duration-500 ${idle ? 'idle-barcode opacity-[0.15]' : 'opacity-[0.15]'}`}
        aria-hidden="true"
      />

      {/* Retro bottom stripe */}
      <div className="retro-stripe-top absolute bottom-0 left-0 right-0" />
    </div>
  );
};

export default WelcomeScreen;
