import { useCallback, useEffect, useRef, useState } from 'react';
import cherreLogo from '@/assets/cherre-logo.jpeg';

interface WelcomeScreenProps {
  onStart: () => void;
  active: boolean;
}

const IDLE_DELAY = 8000;
const BAR_HEIGHTS = [32, 20, 40, 28, 36, 18, 44, 24, 38, 22, 30, 42, 16, 34, 26, 40, 20, 36, 28, 44, 18, 32, 24, 38, 22];

const WelcomeScreen = ({ onStart, active }: WelcomeScreenProps) => {
  const barcodeRef = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const bc = barcodeRef.current;
    if (!bc || bc.childNodes.length > 0) return;
    BAR_HEIGHTS.forEach((h, i) => {
      const span = document.createElement('span');
      span.style.height = h + 'px';
      span.style.display = 'block';
      span.style.background = 'hsl(var(--foreground))';
      span.style.width = '2px';
      span.style.borderRadius = '1px';
      span.style.animationDelay = `${((i / BAR_HEIGHTS.length) * 1.6).toFixed(2)}s`;
      bc.appendChild(span);
    });
  }, []);

  const resetTimer = useCallback(() => {
    setIdle(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIdle(true), IDLE_DELAY);
  }, []);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIdle(false);
      return;
    }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    timerRef.current = setTimeout(() => setIdle(true), IDLE_DELAY);
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, resetTimer]);

  const handleStart = () => {
    resetTimer();
    onStart();
  };

  return (
    <div
      className="flex flex-col justify-center items-center text-center"
      style={{ position: 'absolute', inset: 0, padding: '40px', paddingTop: '60px' }}
    >
      <img src={cherreLogo} alt="Cherre" className="h-14 mb-6 object-contain" style={{ mixBlendMode: "multiply" }} />

      <div className="pill-badge mb-8">
        Price Check on Aisle F
      </div>

      <div className="text-foreground font-black leading-none tracking-tight mb-3" style={{ fontSize: 'clamp(38px, 7vw, 72px)' }}>
        Cherre<br /><span className="text-primary">Data Mart</span>
      </div>

      <div className="text-foreground/70 font-medium mb-8 tracking-wide max-w-[400px]" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
        Scan, search, or look up your item to begin checkout.
      </div>

      <div className="text-[13px] text-foreground/50 italic font-light max-w-[380px] leading-relaxed border border-border rounded-xl px-6 py-4 mb-10 bg-card/60 backdrop-blur-sm">
        "This store has been running on four different inventory systems since 2003. Good luck."
      </div>

      <button
        onClick={handleStart}
        className={`bg-primary text-primary-foreground border-none rounded-xl px-14 py-5 font-sans text-sm font-bold tracking-wide uppercase cursor-pointer transition-all hover:bg-primary-light hover:shadow-lg active:scale-[0.98] shadow-md ${idle ? 'idle-btn' : ''}`}
      >
        Start Lookup
      </button>
    </div>
  );
};

export default WelcomeScreen;
