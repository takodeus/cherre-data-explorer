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
      <div className="modern-accent-top w-full" />

      <div className="bg-background border-b border-border flex items-center justify-center px-6 h-[42px]">
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const isPast    = currentScreen > step.n;
            const isCurrent = currentScreen === step.n;

            return (
              <div key={step.n} className="flex items-center">
                <div className="flex items-center gap-1.5 px-2">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-primary scale-125 shadow-[0_0_8px_hsl(var(--primary)/0.4)]'
                        : isPast
                        ? 'bg-primary/40'
                        : 'bg-border'
                    }`}
                  />
                  <span
                    className={`text-[10px] tracking-wide transition-all duration-300 ${
                      isCurrent
                        ? 'text-primary font-bold'
                        : isPast
                        ? 'text-muted-foreground/60 font-medium'
                        : 'text-muted-foreground/30 font-medium'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className={`h-px w-8 transition-colors duration-500 ${isPast ? 'bg-primary/30' : 'bg-border'}`} />
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
