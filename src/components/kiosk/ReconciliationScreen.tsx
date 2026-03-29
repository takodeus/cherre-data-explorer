import { useEffect, useState } from 'react';
import { TOTAL_VALUES } from '@/lib/kiosk-data';

interface ReconciliationScreenProps {
  onBetterWay: () => void;
  active: boolean;
}

const ReconciliationScreen = ({ onBetterWay, active }: ReconciliationScreenProps) => {
  // Start scrambled so there's no flash of fixed values on re-entry
  const [mainTotal, setMainTotal] = useState(() => '$' + (Math.random() * 120 + 30).toFixed(2));
  const [altTotal, setAltTotal]   = useState(() => 'Or $' + (Math.random() * 80 + 20).toFixed(2) + '.');

  useEffect(() => {
    if (!active) return;
    const pick = TOTAL_VALUES[Math.floor(Math.random() * TOTAL_VALUES.length)];
    let flips = 0;
    const scramble = setInterval(() => {
      setMainTotal('$' + (Math.random() * 120 + 30).toFixed(2));
      setAltTotal('Or $' + (Math.random() * 80 + 20).toFixed(2) + '.');
      flips++;
      if (flips > 10) {
        clearInterval(scramble);
        setMainTotal(pick[0]);
        setAltTotal(pick[1]);
      }
    }, 80);
    return () => clearInterval(scramble);
  }, [active]);

  return (
    <div className="flex flex-col justify-center items-center p-10 bg-background retro-dot-grid" style={{ position: 'absolute', inset: 0 }}>
      <div className="retro-stripe-top absolute top-0 left-0 right-0" />

      <div className="max-w-[560px] w-full flex flex-col items-center text-center">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2.5 bg-destructive/10 border-2 border-destructive/40 rounded-none px-6 py-3 mb-9 shadow-[3px_3px_0_hsl(var(--destructive)/0.2)]">
          <div className="w-4 h-4 rounded-none border-2 border-destructive flex items-center justify-center flex-shrink-0">
            <span className="text-destructive font-black text-[10px]">!</span>
          </div>
          <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-destructive font-mono">
            Reconciliation Required
          </div>
        </div>

        {/* Totals */}
        <div className="mb-10">
          <div className="text-sm text-muted-foreground tracking-wide font-normal mb-4 font-mono">Your total is…</div>
          <div className="text-foreground font-black leading-none tracking-tight mb-2" style={{ fontSize: 'clamp(56px, 10vw, 96px)' }}>
            {mainTotal}
          </div>
          <div className="text-muted-foreground font-light leading-none line-through mb-2" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
            {altTotal}
          </div>
          <div className="text-[13px] text-foreground/30 italic font-light">
            Depends on which system you believe.
          </div>
        </div>

        <div className="w-full h-0 border-t-2 border-dashed border-border my-6" />

        <div className="text-[13px] text-destructive/70 font-normal mb-1.5 tracking-wide font-mono">
          Please see your data analyst.
        </div>
        <div className="text-destructive font-black tracking-wide mb-10" style={{ fontSize: 'clamp(18px, 3vw, 26px)' }}>
          Wait time: 6 hours.
        </div>

        <button
          onClick={onBetterWay}
          className="bg-background border-2 border-primary text-primary rounded-none px-12 py-4.5 font-sans text-sm font-bold tracking-[0.1em] uppercase cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98] shadow-[4px_4px_0_hsl(var(--primary))]"
        >
          There is a better way →
        </button>
      </div>

      <div className="retro-stripe-top absolute bottom-0 left-0 right-0" />
    </div>
  );
};

export default ReconciliationScreen;
