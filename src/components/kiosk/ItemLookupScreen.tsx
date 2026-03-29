import { useState, useCallback } from 'react';
import { ITEMS, LOOKUP_METHODS, LOADING_MESSAGES, type LookupType } from '@/lib/kiosk-data';
import { scanBeep } from '@/lib/kiosk-audio';

type CardState = 'idle' | 'loading' | 'done';

interface ItemLookupScreenProps {
  soundOn: boolean;
  itemsWithQuery: Set<number>;
  setItemsWithQuery: (s: Set<number>) => void;
  queriedMethods: Set<number>[];
  setQueriedMethods: (m: Set<number>[]) => void;
  onCheckout: () => void;
}

// Derive a teaser: first line, capped at 48 chars, with trailing ellipsis
const teaser = (text: string): string => {
  const first = text.split('\n')[0].replace(/^"/, '').replace(/"$/, '');
  return first.length > 48 ? first.slice(0, 46) + '…' : first;
};

const statusLabel = (type: LookupType) => {
  if (type === 'ok') return '✓ Match found';
  if (type === 'err') return '✕ Error';
  return '⚠ Warning';
};

const statusBadgeClass = (type: LookupType) => {
  if (type === 'ok') return 'text-primary border-primary bg-primary-light-bg';
  if (type === 'err') return 'text-destructive border-destructive/40 bg-destructive/5';
  return 'text-warning-foreground border-warning/40 bg-warning/10';
};

const bodyClass = (type: LookupType) => {
  if (type === 'ok') return 'text-foreground';
  if (type === 'err') return 'text-destructive font-mono text-[12px]';
  return 'text-warning-foreground';
};

const ItemLookupScreen = ({
  soundOn,
  itemsWithQuery,
  setItemsWithQuery,
  queriedMethods,
  setQueriedMethods,
  onCheckout,
}: ItemLookupScreenProps) => {
  const [currentItem, setCurrentItem] = useState(0);
  // cardStates[itemIdx][methodIdx] = 'idle' | 'loading' | 'done'
  const [cardStates, setCardStates] = useState<CardState[][]>(
    ITEMS.map(() => LOOKUP_METHODS.map(() => 'idle' as CardState))
  );
  // loadingMsg per card: [itemIdx][methodIdx]
  const [loadingMsgs, setLoadingMsgs] = useState<string[][]>(
    ITEMS.map(() => LOOKUP_METHODS.map(() => ''))
  );

  const setCardState = useCallback((itemIdx: number, methodIdx: number, state: CardState) => {
    setCardStates(prev => {
      const next = prev.map(row => [...row]);
      next[itemIdx][methodIdx] = state;
      return next;
    });
  }, []);

  const setCardMsg = useCallback((itemIdx: number, methodIdx: number, msg: string) => {
    setLoadingMsgs(prev => {
      const next = prev.map(row => [...row]);
      next[itemIdx][methodIdx] = msg;
      return next;
    });
  }, []);

  const runLookup = useCallback((methodIdx: number) => {
    const itemIdx = currentItem;
    // Already queried or loading — no-op
    if (cardStates[itemIdx][methodIdx] !== 'idle') return;

    if (soundOn) scanBeep();

    setCardState(itemIdx, methodIdx, 'loading');
    setCardMsg(itemIdx, methodIdx, 'Connecting to system…');

    // Update queried tracking immediately
    const newQueried = queriedMethods.map(s => new Set(s));
    newQueried[itemIdx].add(methodIdx);
    setQueriedMethods(newQueried);
    setItemsWithQuery(new Set(itemsWithQuery).add(itemIdx));

    let mi = 0;
    const msgInterval = setInterval(() => {
      mi++;
      if (mi < LOADING_MESSAGES.length) {
        setCardMsg(itemIdx, methodIdx, LOADING_MESSAGES[mi]);
      }
    }, 280);

    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      clearInterval(msgInterval);
      setCardState(itemIdx, methodIdx, 'done');
    }, delay);
  }, [currentItem, cardStates, soundOn, queriedMethods, itemsWithQuery, setQueriedMethods, setItemsWithQuery, setCardState, setCardMsg]);

  const count = itemsWithQuery.size;
  const item = ITEMS[currentItem];

  return (
    <div className="flex flex-col bg-background" style={{ position: 'absolute', inset: 0 }}>
      {/* Retro stripe */}
      <div className="retro-stripe-top" />

      {/* Header */}
      <div className="bg-primary px-10 pt-6 pb-5 flex items-end justify-between retro-border-bottom">
        <div>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary-foreground/70 mb-1 font-mono">
            Self-checkout — Item Lookup
          </div>
          <div className="text-primary-foreground font-extrabold tracking-tight" style={{ fontSize: 'clamp(20px, 3.5vw, 28px)' }}>
            Each system has an answer. They don't agree.
          </div>
        </div>
        <div className="price-tag text-[10px] font-bold tracking-[0.08em]">
          Step 2 of 5
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Items column */}
        <div className="w-[220px] flex-shrink-0 border-r-2 border-border bg-card py-4 flex flex-col gap-1 px-2">
          {ITEMS.map((it, i) => {
            const doneCount = cardStates[i].filter(s => s === 'done').length;
            return (
              <button
                key={i}
                onClick={() => setCurrentItem(i)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-2 text-left w-full transition-all rounded-none ${
                  i === currentItem
                    ? 'bg-primary-light-bg border-primary shadow-[3px_3px_0_hsl(var(--primary))]'
                    : 'bg-background border-border hover:border-primary/40 hover:bg-primary-light-bg/50'
                }`}
              >
                <div className="w-10 h-10 rounded-none border-2 border-primary/30 bg-background flex items-center justify-center text-lg flex-shrink-0">
                  {it.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-foreground">{it.name}</div>
                  <div className="text-[10px] text-muted-foreground font-normal mt-px font-mono">{it.category}</div>
                  {doneCount > 0 && (
                    <div className="text-[9px] font-mono text-primary mt-1">
                      {doneCount}/{LOOKUP_METHODS.length} queried
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Cards area */}
        <div className="flex-1 px-6 py-5 overflow-y-auto flex flex-col gap-3 retro-dot-grid">

          {/* Item label */}
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="text-[11px] font-mono font-bold tracking-[0.12em] uppercase text-muted-foreground">Looking up</div>
              <div className="text-[15px] font-extrabold text-foreground tracking-tight">{item.name}</div>
            </div>
          </div>

          {/* One card per lookup method */}
          {LOOKUP_METHODS.map((method, methodIdx) => {
            const state = cardStates[currentItem][methodIdx];
            const lookup = item.lookups[methodIdx];
            const msg = loadingMsgs[currentItem][methodIdx];
            const isDone = state === 'done';
            const isLoading = state === 'loading';
            const isIdle = state === 'idle';

            return (
              <div
                key={methodIdx}
                className={`rounded-none border-2 transition-all duration-300 overflow-hidden ${
                  isDone
                    ? lookup.type === 'ok'
                      ? 'border-primary shadow-[3px_3px_0_hsl(var(--primary)/0.25)]'
                      : lookup.type === 'err'
                      ? 'border-destructive/50 shadow-[3px_3px_0_hsl(var(--destructive)/0.15)]'
                      : 'border-warning/50 shadow-[3px_3px_0_hsl(var(--warning)/0.15)]'
                    : isLoading
                    ? 'border-primary/40 border-dashed'
                    : 'border-border hover:border-primary/40'
                } bg-card`}
              >
                {/* Card header row — always visible */}
                <div className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Status dot */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isDone
                        ? lookup.type === 'ok' ? 'bg-primary' : lookup.type === 'err' ? 'bg-destructive' : 'bg-warning'
                        : isLoading ? 'bg-primary animate-pulse' : 'bg-border'
                    }`} />
                    <div>
                      <div className="text-[9px] font-bold tracking-[0.16em] uppercase font-mono text-muted-foreground">
                        System {String.fromCharCode(65 + methodIdx)}
                      </div>
                      <div className="text-[12px] font-bold text-foreground">{method}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isDone && (
                      <span className={`text-[9px] font-bold tracking-[0.1em] uppercase font-mono border px-2 py-0.5 ${statusBadgeClass(lookup.type)}`}>
                        {statusLabel(lookup.type)}
                      </span>
                    )}
                    {isIdle && (
                      <button
                        onClick={() => runLookup(methodIdx)}
                        className="bg-background border-2 border-border text-muted-foreground rounded-none px-3 py-1 font-mono text-[10px] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all hover:border-primary hover:text-foreground shadow-[2px_2px_0_hsl(var(--border))] hover:shadow-[2px_2px_0_hsl(var(--primary))]"
                      >
                        Query →
                      </button>
                    )}
                    {isLoading && (
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                            style={{ animation: `pulse-dot 0.8s ease infinite ${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Teaser — visible when idle, replaced by result when done */}
                {isIdle && (
                  <div className="px-4 pb-3 border-t border-dashed border-border/60 pt-2.5">
                    <div className="text-[11px] font-mono text-muted-foreground/50 truncate select-none blur-[2px] pointer-events-none">
                      {teaser(lookup.text)}
                    </div>
                    <div className="text-[9px] text-muted-foreground/30 font-mono mt-0.5 tracking-wide">
                      — Query to reveal
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="px-4 pb-3 border-t border-dashed border-primary/20 pt-2.5">
                    <div className="text-[11px] font-mono text-primary/60 tracking-wide">{msg}</div>
                  </div>
                )}

                {isDone && (
                  <div className="px-4 pb-4 border-t border-border/40 pt-3 animate-fade-in-up">
                    <div className={`text-[13px] font-normal leading-relaxed whitespace-pre-line ${bodyClass(lookup.type)}`}>
                      {lookup.text}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t-2 border-border flex items-center justify-between bg-card">
        <div className="flex gap-2 items-center">
          {ITEMS.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-none transition-colors border ${
                i < count ? 'bg-primary border-primary' : i === count ? 'bg-foreground border-foreground' : 'bg-border border-border'
              }`}
            />
          ))}
          <span className="text-[11px] text-muted-foreground tracking-[0.06em] ml-1 font-mono">
            {count} of {ITEMS.length} items queried
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={count < 2}
          className={`bg-primary text-primary-foreground border-none rounded-none px-8 py-3 font-sans text-xs font-bold tracking-[0.1em] uppercase cursor-pointer transition-all active:scale-[0.97] ${
            count >= 2 ? 'opacity-100 hover:bg-primary-light shadow-[3px_3px_0_hsl(var(--foreground))]' : 'opacity-30 pointer-events-none'
          }`}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
};

export default ItemLookupScreen;
