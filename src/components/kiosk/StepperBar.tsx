import { useEffect, useRef } from 'react';
import { ITEMS } from '@/lib/kiosk-data';

interface StepperBarProps {
  currentScreen: number;
  itemsWithQuery: Set<number>;
  maxReached: number;
  onNavigate: (screen: number) => void;
}

const STEPS = [
  { n: 1, label: 'Welcome' },
  { n: 2, label: 'Lookup' },
  { n: 3, label: 'Problem' },
  { n: 4, label: 'Solution' },
  { n: 5, label: 'Receipt' },
];

const StepperBar = ({ currentScreen, itemsWithQuery, maxReached, onNavigate }: StepperBarProps) => {
  const cartCount = itemsWithQuery.size;
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(cartCount);

  // Pulse the badge when count increases
  useEffect(() => {
    if (cartCount > prevCount.current && badgeRef.current) {
      badgeRef.current.classList.remove('cart-badge-pop');
      void badgeRef.current.offsetWidth; // force reflow
      badgeRef.current.classList.add('cart-badge-pop');
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <div className="flex-shrink-0 relative z-50">
      <div className="modern-accent-top w-full" />

      <div className="bg-background border-b border-border flex items-center px-6 h-[42px]">
        {/* Stepper — centred */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {STEPS.map((step, i) => {
            const isPast      = currentScreen > step.n;
            const isCurrent   = currentScreen === step.n;
            const isNavigable = step.n <= maxReached && !isCurrent;

            return (
              <div key={step.n} className="flex items-center">
                <button
                  onClick={() => isNavigable && onNavigate(step.n)}
                  disabled={!isNavigable}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-150 ${
                    isNavigable
                      ? 'cursor-pointer hover:bg-primary/8'
                      : 'cursor-default'
                  }`}
                >
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
                </button>

                {i < STEPS.length - 1 && (
                  <div className={`h-px w-8 transition-colors duration-500 ${isPast ? 'bg-primary/30' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Cart indicator — right side, visible on screens 2–3 while items exist */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            cartCount > 0 && currentScreen <= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label={`${cartCount} item${cartCount !== 1 ? 's' : ''} in cart`}
        >
          {/* Mini item icons */}
          <div className="flex items-center gap-0.5">
            {ITEMS.map((item, i) => (
              <span
                key={i}
                className={`text-[13px] leading-none transition-all duration-200 ${
                  itemsWithQuery.has(i) ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                }`}
                style={{ display: 'inline-block' }}
              >
                {item.icon}
              </span>
            ))}
          </div>

          {/* Count badge */}
          <span
            ref={badgeRef}
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none flex-shrink-0"
          >
            {cartCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepperBar;
