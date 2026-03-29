interface ResolutionScreenProps {
  onTalk: () => void;
}

const ResolutionScreen = ({ onTalk }: ResolutionScreenProps) => {
  return (
    <div className="flex flex-col justify-center items-center" style={{ position: 'absolute', inset: 0, background: 'hsl(var(--primary))', padding: '48px 40px' }}>
      <div className="max-w-[600px] w-full flex flex-col items-start">
        <div className="text-[11px] font-semibold tracking-wide uppercase text-primary-foreground/60 mb-5">
          cherre.com — unified real estate data
        </div>

        <div className="text-primary-foreground font-black leading-none tracking-tight mb-7" style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}>
          One item.<br />One definition.<br />One answer.
        </div>

        <div className="text-primary-foreground/80 font-normal leading-relaxed max-w-[480px] mb-12" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
          Cherre maps every data point to a unified ontology built for real estate. No reconciliation. No ambiguity. No 6-hour spreadsheet.
        </div>

        {/* Stats */}
        <div className="flex rounded-2xl overflow-hidden w-full max-w-[480px] mb-12 bg-primary-foreground/10 backdrop-blur-sm">
          {[
            { num: '4B+', label: 'Legal entities resolved' },
            { num: '160M', label: 'Parcels mapped' },
            { num: '120+', label: 'Data vendors connected' },
          ].map((stat, i) => (
            <div key={i} className={`flex-1 px-6 py-5 ${i < 2 ? 'border-r border-primary-foreground/10' : ''}`}>
              <div className="text-primary-foreground font-black leading-none tracking-tight mb-1" style={{ fontSize: 'clamp(22px, 3.5vw, 36px)' }}>
                {stat.num}
              </div>
              <div className="text-[10px] font-semibold tracking-wide uppercase text-primary-foreground/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Row */}
        <div className="flex items-center gap-8 w-full max-w-[480px]">
          <button
            onClick={onTalk}
            className="bg-primary-foreground text-primary border-none rounded-xl px-10 py-4 font-sans text-[13px] font-extrabold tracking-wide uppercase cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] flex-shrink-0 shadow-md"
          >
            Talk to the team
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 bg-primary-foreground rounded-xl p-1.5 flex-shrink-0 shadow-sm">
              <svg className="w-full h-full" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <rect width="52" height="52" fill="white" rx="4" />
                <g fill="hsl(var(--primary))">
                  <rect x="2" y="2" width="18" height="18" rx="2" />
                  <rect x="4" y="4" width="14" height="14" fill="white" rx="1" />
                  <rect x="6" y="6" width="10" height="10" fill="hsl(var(--primary))" rx="1" />
                  <rect x="32" y="2" width="18" height="18" rx="2" />
                  <rect x="34" y="4" width="14" height="14" fill="white" rx="1" />
                  <rect x="36" y="6" width="10" height="10" fill="hsl(var(--primary))" rx="1" />
                  <rect x="2" y="32" width="18" height="18" rx="2" />
                  <rect x="4" y="34" width="14" height="14" fill="white" rx="1" />
                  <rect x="6" y="36" width="10" height="10" fill="hsl(var(--primary))" rx="1" />
                  <rect x="22" y="2" width="8" height="4" />
                  <rect x="22" y="8" width="4" height="4" />
                  <rect x="28" y="8" width="4" height="4" />
                  <rect x="22" y="14" width="8" height="6" />
                  <rect x="32" y="22" width="4" height="4" />
                  <rect x="38" y="22" width="4" height="4" />
                  <rect x="44" y="22" width="6" height="4" />
                  <rect x="32" y="28" width="6" height="4" />
                  <rect x="40" y="28" width="10" height="4" />
                  <rect x="32" y="34" width="4" height="6" />
                  <rect x="38" y="36" width="6" height="4" />
                  <rect x="46" y="34" width="4" height="4" />
                  <rect x="2" y="22" width="4" height="4" />
                  <rect x="8" y="22" width="6" height="4" />
                  <rect x="16" y="22" width="4" height="4" />
                  <rect x="22" y="22" width="8" height="4" />
                  <rect x="2" y="28" width="8" height="4" />
                  <rect x="12" y="28" width="8" height="4" />
                  <rect x="22" y="28" width="4" height="4" />
                  <rect x="44" y="40" width="6" height="10" />
                  <rect x="32" y="42" width="8" height="4" />
                  <rect x="22" y="34" width="8" height="4" />
                  <rect x="22" y="40" width="4" height="10" />
                  <rect x="28" y="46" width="8" height="4" />
                </g>
              </svg>
            </div>
            <div>
              <div className="text-[11px] text-primary-foreground/60 leading-snug font-normal">
                Scan to connect<br />with the Cherre team
              </div>
              <div className="text-xs font-bold text-primary-foreground/90 mt-0.5">cherre.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionScreen;
