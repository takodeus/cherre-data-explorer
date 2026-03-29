interface ReceiptScreenProps {
  onRestart: () => void;
  onBackToCherre: () => void;
}

const ReceiptScreen = ({ onRestart, onBackToCherre }: ReceiptScreenProps) => {
  return (
    <div className="flex flex-col justify-center items-center p-8" style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }}>
      <div className="receipt bg-cream w-full max-w-[400px] rounded-sm px-8 py-9 font-mono text-card-foreground relative">
        <div className="text-center mb-5">
          <div className="text-base font-bold tracking-[0.12em] mb-1 text-primary">CHERRE DATA MART</div>
          <div className="text-[9px] text-muted-foreground tracking-wide">Self-Checkout Terminal — Aisle F</div>
        </div>

        <div className="text-[10px] text-muted-foreground/40 text-center tracking-wide my-3">========================</div>

        <div className="flex justify-between text-[9px] text-muted-foreground tracking-[0.1em] uppercase mb-2">
          <span>Item</span>
          <span>Result</span>
        </div>
        <hr className="border-none border-t border-dashed border-muted-foreground/30 my-2.5" />

        {['Ontolo-Tea', 'Alpha Bytes', 'Cherries'].map(item => (
          <div key={item} className="flex justify-between items-start text-xs py-1.5 border-b border-dotted border-cream-dark gap-2">
            <span className="text-card-foreground/80 font-normal">{item}</span>
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

        <hr className="border-none border-t border-dashed border-muted-foreground/30 my-2.5" />

        <div className="flex justify-between items-center py-2.5 text-sm">
          <span className="font-bold tracking-[0.08em]">TOTAL</span>
          <span className="text-primary font-bold text-base">TRUSTED</span>
        </div>
        <div className="text-[9px] text-muted-foreground/30 text-right mt-0.5">No reconciliation needed.</div>

        <div className="text-[10px] text-muted-foreground/40 text-center tracking-wide mt-5">========================</div>

        <div className="text-center mt-5">
          <div className="text-[11px] text-muted-foreground/50 italic mb-1">StayCurious.</div>
          <div className="text-[10px] text-primary tracking-[0.08em] font-bold">cherre.com</div>
        </div>
      </div>

      <div className="flex gap-3 mt-8 justify-center">
        <button
          onClick={onRestart}
          className="bg-transparent border border-foreground/15 text-muted-foreground rounded px-7 py-3 font-sans text-[11px] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all hover:border-primary hover:text-foreground"
        >
          Start over
        </button>
        <button
          onClick={onBackToCherre}
          className="bg-primary text-primary-foreground border-none rounded px-7 py-3 font-sans text-[11px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-colors hover:bg-primary-light"
        >
          ← Back to Cherre
        </button>
      </div>
    </div>
  );
};

export default ReceiptScreen;
