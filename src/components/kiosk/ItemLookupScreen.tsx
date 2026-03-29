import { useState, useCallback } from 'react';
import { ITEMS, LOOKUP_METHODS, LOADING_MESSAGES, type LookupType } from '@/lib/kiosk-data';
import { scanBeep } from '@/lib/kiosk-audio';

// 'loading' is still local — only 'done' is derived from persisted queriedMethods
type CardState = 'idle' | 'loading' | 'done';

interface ItemLookupScreenProps {
  soundOn: boolean;
  currentItem: number;
  onSelectItem: (idx: number) => void;
  itemsWithQuery: Set<number>;
  setItemsWithQuery: (updater: (prev: Set<number>) => Set<number>) => void;
  queriedMethods: Set<number>[];
  setQueriedMethods: (updater: (prev: Set<number>[]) => Set<number>[]) => void;
  onCheckout: () => void;
}

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
  currentItem,
  onSelectItem,
  itemsWithQuery,
  setItemsWithQuery,
  queriedMethods,
  setQueriedMethods,
  onCheckout,
}: ItemLookupScreenProps) => {
  // loadingCards tracks in-flight queries — local only, intentionally resets on nav
  const [loadingCards, setLoadingCards] = useState<Record<string, boolean>>({});
  const [loadingMsgs, setLoadingMsgs] = useState<string[][]>(
    ITEMS.map(() => LOOKUP_METHODS.map(() => ''))
  );

  const cardKey = (itemIdx: number, methodIdx: number) => `${itemIdx}-${methodIdx}`;

  const setCardLoading = useCallback((itemIdx: number, methodIdx: number, loading: boolean) => {
    setLoadingCards(prev => {
      const next = { ...prev };
      if (loading) next[cardKey(itemIdx, methodIdx)] = true;
      else delete next[cardKey(itemIdx, methodIdx)];
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

  const anyLoading = Object.keys(loadingCards).length > 0;

  const runLookup = useCallback((methodIdx: number) => {
    const itemIdx = currentItem;
    // Already done (persisted) or currently loading — no-op
    if (queriedMethods[itemIdx]?.has(methodIdx)) return;
    if (loadingCards[cardKey(itemIdx, methodIdx)]) return;

    if (soundOn) scanBeep();

    setCardLoading(itemIdx, methodIdx, true);
    setCardMsg(itemIdx, methodIdx, 'Connecting to system…');

    // Persist immediately via functional updaters — immune to stale closures
    setQueriedMethods(prev => {
      const next = prev.map(s => new Set(s));
      next[itemIdx].add(methodIdx);
      return next;
    });
    setItemsWithQuery(prev => new Set(prev).add(itemIdx));

    let mi = 0;
    const msgInterval = setInterval(() => {
      mi++;
      if (mi < LOADING_MESSAGES.length) setCardMsg(itemIdx, methodIdx, LOADING_MESSAGES[mi]);
    }, 280);

    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      clearInterval(msgInterval);
      setCardLoading(itemIdx, methodIdx, false);
    }, delay);
  }, [currentItem, queriedMethods, loadingCards, soundOn, setQueriedMethods, setItemsWithQuery, setCardLoading, setCardMsg]);

  const count = itemsWithQuery.size;
  const item = ITEMS[currentItem];

  return (
    <div className="flex flex-col bg-background" style={{ position: 'absolute', inset: 0 }}>
      <div className="retro-stripe-top" />

      <div className="bg-primary px-10 pt-6 pb-5 flex items-end justify-between retro-border-bottom">
        <div>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary-foreground/70 mb-1 font-mono">
            Self-checkout — Item Lookup
          </div>
          <div className="text-primary-foreground font-extrabold tracking-tight" style={{ fontSize: 'clamp(20px, 3.5vw, 28px)' }}>
            Each system has an answer. They don't agree.
          </div>
        </div>
        <div className="price-tag text-[10px] font-bold tracking-[0.08em]">Step 2 of 5</div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Items column */}
        <div className="w-[220px] flex-shrink-0 border-r-2 border-border bg-card py-4 flex flex-col gap-1 px-2">
          {ITEMS.map((it, i) => {
            const doneCount = queriedMethods[i]?.size ?? 0;
            return (
              <button
                key={i}
                onClick={() => onSelectItem(i)}
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
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="text-[11px] font-mono font-bold tracking-[0.12em] uppercase text-muted-foreground">Looking up</div>
              <div className="text-[15px] font-extrabold text-foreground tracking-tight">{item.name}</div>
            </div>
          </div>

          {LOOKUP_METHODS.map((method, methodIdx) => {
            const isDone    = queriedMethods[currentItem]?.has(methodIdx) && !loadingCards[cardKey(currentItem, methodIdx)];
            const isLoading = !!loadingCards[cardKey(currentItem, methodIdx)];
            const isIdle    = !isDone && !isLoading;
            const lookup    = item.lookups[methodIdx];
            const msg       = loadingMsgs[currentItem][methodIdx];

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
                {/* Header row */}
                <div className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
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

                {/* Body */}
                {isIdle && (
                  <div className="px-4 pb-3 border-t border-dashed border-border/60 pt-2.5">
                    <div className="text-[11px] font-mono text-muted-foreground/50 truncate select-none blur-[2px] pointer-events-none">
                      {teaser(lookup.text)}
                    </div>
                    <div className="text-[9px] text-muted-foreground/30 font-mono mt-0.5 tracking-wide">— Query to reveal</div>
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
                itemsWithQuery.has(i) ? 'bg-primary border-primary' : i === count ? 'bg-foreground border-foreground' : 'bg-border border-border'
              }`}
            />
          ))}
          <span className="text-[11px] text-muted-foreground tracking-[0.06em] ml-1 font-mono">
            {count} of {ITEMS.length} items queried
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={count < 2 || anyLoading}
          className={`bg-primary text-primary-foreground border-none rounded-none px-8 py-3 font-sans text-xs font-bold tracking-[0.1em] uppercase cursor-pointer transition-all active:scale-[0.97] ${
            count >= 2 && !anyLoading
              ? 'opacity-100 hover:bg-primary-light shadow-[3px_3px_0_hsl(var(--foreground))]'
              : 'opacity-30 pointer-events-none'
          }`}
        >
          {anyLoading ? 'Querying…' : 'Proceed to checkout'}
        </button>
      </div>
    </div>
  );
};

export default ItemLookupScreen;
