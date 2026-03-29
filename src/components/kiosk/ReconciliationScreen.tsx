import { useEffect, useState } from 'react';
import { TOTAL_VALUES } from '@/lib/kiosk-data';

interface ReconciliationScreenProps {
  onBetterWay: () => void;
  active: boolean;
}

const ReconciliationScreen = ({ onBetterWay, active }: ReconciliationScreenProps) => {
  const [mainTotal, setMainTotal] = useState('$94.17');
  const [altTotal, setAltTotal] = useState('Or $47.83.');

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
    <div className="flex flex-col justify-center items-center p-10" style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }}>
      <div className="max-w-[560px] w-full flex flex-col items-center text-center">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2.5 bg-destructive/[0.12] border border-destructive/30 rounded px-5 py-2.5 mb-9">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-destructive flex items-center justify-center flex-shrink-0">
            <div className="w-0.5 h-1.5 bg-destructive rounded-sm" />
          </div>
          <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-destructive/70">
            Reconciliation Required
          </div>
        </div>

        {/* Totals */}
        <div className="mb-10">
          <div className="text-sm text-muted tracking-wide font-normal mb-4">Your total is…</div>
          <div className="text-foreground font-black leading-none tracking-tight mb-2" style={{ fontSize: 'clamp(56px, 10vw, 96px)' }}>
            {mainTotal}
          </div>
          <div className="text-muted font-light leading-none line-through mb-1.5" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
            {altTotal}
          </div>
          <div className="text-[13px] text-foreground/20 italic font-light">
            Depends on which system you believe.
          </div>
        </div>

        <div className="w-full h-px bg-foreground/[0.06] my-8" />

        <div className="text-[13px] text-destructive/70 font-normal mb-1.5 tracking-wide">
          Please see your data analyst.
        </div>
        <div className="text-destructive font-bold tracking-wide mb-10" style={{ fontSize: 'clamp(18px, 3vw, 26px)' }}>
          Wait time: 6 hours.
        </div>

        <button
          onClick={onBetterWay}
          className="bg-transparent border-2 border-primary text-primary rounded px-12 py-4.5 font-sans text-sm font-bold tracking-[0.1em] uppercase cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
        >
          There is a better way →
        </button>
      </div>
    </div>
  );
};

export default ReconciliationScreen;
