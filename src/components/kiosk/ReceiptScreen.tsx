interface ReceiptScreenProps {
  onRestart: () => void;
  onBackToCherre: () => void;
}

const ReceiptScreen = ({ onRestart, onBackToCherre }: ReceiptScreenProps) => {
  return (
    <div className="flex flex-col justify-center items-center p-8 bg-card retro-dot-grid" style={{ position: 'absolute', inset: 0 }}>
      <div className="retro-stripe-top absolute top-0 left-0 right-0" />

      <div className="receipt bg-cream w-full max-w-[400px] rounded-none px-8 py-9 font-mono text-foreground relative border-2 border-foreground/10 shadow-[6px_6px_0_hsl(var(--foreground)/0.08)]">
        <div className="text-center mb-5">
          <div className="text-base font-bold tracking-[0.12em] mb-1 text-primary">CHERRE DATA MART</div>
          <div className="text-[9px] text-muted-foreground tracking-wide">Self-Checkout Terminal — Aisle F</div>
        </div>

        <div className="text-[10px] text-foreground/20 text-center tracking-wide my-3 select-none">========================</div>

        <div className="flex justify-between text-[9px] text-muted-foreground tracking-[0.1em] uppercase mb-2">
          <span>Item</span>
          <span>Result</span>
        </div>
        <hr className="border-none border-t border-dashed border-foreground/15 my-2.5" />

        {['Ontolo-Tea', 'Alpha Bytes', 'Cherries'].map(item => (
          <div key={item} className="flex justify-between items-start text-xs py-1.5 border-b border-dotted border-foreground/10 gap-2">
            <span className="text-foreground/70 font-normal">{item}</span>
            <span className="text-success font-bold">Resolved</span>
          </div>
        ))}

        <div className="flex justify-between items-start text-xs py-1.5 gap-2">
          <span className="text-muted-foreground/50 font-normal">Mystery Item</span>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground/60 leading-snug">Classification Pending.</div>
            <div className="text-[9px] text-muted-foreground/40 leading-snug mt-0.5">Check back at<br />Realcomm 2026.</div>
          </div>
        </div>

        <hr className="border-none border-t border-dashed border-foreground/15 my-2.5" />

        <div className="flex justify-between items-center py-2.5 text-sm">
          <span className="font-bold tracking-[0.08em]">TOTAL</span>
          <span className="text-primary font-bold text-base">TRUSTED</span>
        </div>
        <div className="text-[9px] text-muted-foreground/40 text-right mt-0.5">No reconciliation needed.</div>

        <div className="text-[10px] text-foreground/20 text-center tracking-wide mt-5 select-none">========================</div>

        <div className="text-center mt-5">
          <div className="text-[11px] text-muted-foreground/50 italic mb-1">StayCurious.</div>
          <div className="text-[10px] text-primary tracking-[0.08em] font-bold">cherre.com</div>
        </div>
      </div>

      <div className="flex gap-3 mt-8 justify-center">
        <button
          onClick={onRestart}
          className="bg-background border-2 border-border text-muted-foreground rounded-none px-7 py-3 font-sans text-[11px] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all hover:border-primary hover:text-foreground shadow-[2px_2px_0_hsl(var(--border))]"
        >
          Start over
        </button>
        <button
          onClick={onBackToCherre}
          className="bg-primary text-primary-foreground border-none rounded-none px-7 py-3 font-sans text-[11px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-colors hover:bg-primary-light shadow-[3px_3px_0_hsl(var(--foreground))]"
        >
          ← Back to Cherre
        </button>
      </div>

      <div className="retro-stripe-top absolute bottom-0 left-0 right-0" />
    </div>
  );
};

export default ReceiptScreen;
