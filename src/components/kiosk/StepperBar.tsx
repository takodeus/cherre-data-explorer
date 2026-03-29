interface StepperBarProps {
  currentScreen: number;
}

const STEPS = [
  { n: 1, label: 'Welcome' },
  { n: 2, label: 'Lookup' },
  { n: 3, label: 'Problem' },
  { n: 4, label: 'Solution' },
  { n: 5, label: 'Receipt' },
];

const StepperBar = ({ currentScreen }: StepperBarProps) => {
  return (
    <div className="flex-shrink-0 relative z-50">
      {/* Primary stripe — global top accent */}
      <div className="h-1 bg-primary w-full" />

      {/* Stepper row */}
      <div className="bg-background border-b-2 border-border flex items-center justify-center px-6 h-[38px]">
        <div className="flex items-center">
          {STEPS.map((step, i) => {
            const isPast    = currentScreen > step.n;
            const isCurrent = currentScreen === step.n;

            return (
              <div key={step.n} className="flex items-center">
                {/* Step node */}
                <div className="flex items-center gap-1.5">
                  {/* Dot */}
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-primary scale-125'
                        : isPast
                        ? 'bg-primary/40'
                        : 'bg-transparent border border-border'
                    }`}
                  />
                  {/* Label */}
                  <span
                    className={`font-mono text-[9px] tracking-[0.12em] uppercase transition-all duration-300 ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isPast
                        ? 'text-muted-foreground/60'
                        : 'text-muted-foreground/30'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector — not after last step */}
                {i < STEPS.length - 1 && (
                  <div className="flex items-center mx-2.5">
                    <div className={`h-px w-6 transition-colors duration-500 ${isPast ? 'bg-primary/35' : 'bg-border'}`} />
                    <span className={`text-[8px] mx-0.5 leading-none transition-colors duration-300 ${isPast ? 'text-primary/30' : 'text-border'}`}>›</span>
                    <div className={`h-px w-6 transition-colors duration-500 ${isPast ? 'bg-primary/35' : 'bg-border'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepperBar;
