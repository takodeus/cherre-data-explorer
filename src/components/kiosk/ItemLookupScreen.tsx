import { useState, useCallback } from 'react';
import { ITEMS, LOOKUP_METHODS, LOADING_MESSAGES, type LookupType } from '@/lib/kiosk-data';
import { scanBeep } from '@/lib/kiosk-audio';

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
  if (type === 'ok') return 'text-primary border-primary/20 bg-primary-light-bg';
  if (type === 'err') return 'text-destructive border-destructive/20 bg-destructive/5';
  return 'text-warning-foreground border-warning/20 bg-warning/10';
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
  const [loadingCards, setLoadingCards] = useState<Record<string, boolean>>({});
  const [scanningCard, setScanningCard] = useState<string | null>(null);
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
    if (queriedMethods[itemIdx]?.has(methodIdx)) return;
    if (loadingCards[cardKey(itemIdx, methodIdx)]) return;

    if (soundOn) scanBeep();

    const ck = cardKey(itemIdx, methodIdx);
    setScanningCard(ck);
    setTimeout(() => setScanningCard(null), 800);

    setCardLoading(itemIdx, methodIdx, true);
    setCardMsg(itemIdx, methodIdx, 'Connecting to system…');

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
      {/* Header */}
      <div className="bg-primary px-10 pt-6 pb-5 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-semibold tracking-wide uppercase text-primary-foreground/70 mb-1">
            Self-checkout — Item Lookup
          </div>
          <div className="text-primary-foreground font-extrabold tracking-tight" style={{ fontSize: 'clamp(20px, 3.5vw, 28px)' }}>
            Each system has an answer. They don't agree.
          </div>
        </div>
        <div className="pill-badge text-[10px]" style={{ background: 'hsl(var(--primary-deep))' }}>Step 2 of 5</div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Items column */}
        <div className="w-[220px] flex-shrink-0 border-r border-border bg-card py-4 flex flex-col gap-1.5 px-2">
          {ITEMS.map((it, i) => {
            const doneCount = queriedMethods[i]?.size ?? 0;
            return (
              <button
                key={i}
                onClick={() => onSelectItem(i)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border text-left w-full transition-all rounded-lg ${
                  i === currentItem
                    ? 'bg-primary-light-bg border-primary/30 shadow-sm'
                    : 'bg-background border-transparent hover:border-border hover:bg-card'
                }`}
              >
                <div className="w-10 h-10 rounded-lg border border-border bg-background flex items-center justify-center text-lg flex-shrink-0">
                  {it.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-foreground">{it.name}</div>
                  <div className="text-[10px] text-muted-foreground font-medium mt-px">{it.category}</div>
                  {doneCount > 0 && (
                    <div className="text-[9px] font-medium text-primary mt-1">
                      {doneCount}/{LOOKUP_METHODS.length} queried
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Cards area */}
        <div className="flex-1 px-6 py-5 overflow-y-auto flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground">Looking up</div>
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
                className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
                  isDone
                    ? lookup.type === 'ok'
                      ? 'border-primary/30 shadow-sm bg-primary-light-bg/30'
                      : lookup.type === 'err'
                      ? 'border-destructive/20 shadow-sm bg-destructive/[0.02]'
                      : 'border-warning/20 shadow-sm bg-warning/[0.03]'
                    : isLoading
                    ? 'border-primary/30 bg-primary-light-bg/20'
                    : 'border-border hover:border-primary/20 hover:shadow-sm'
                } bg-card`}
              >
                {/* Scan laser */}
                {scanningCard === cardKey(currentItem, methodIdx) && (
                  <div className="scan-laser" />
                )}
                {/* Header row */}
                <div className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isDone
                        ? lookup.type === 'ok' ? 'bg-primary' : lookup.type === 'err' ? 'bg-destructive' : 'bg-warning'
                        : isLoading ? 'bg-primary animate-pulse' : 'bg-border'
                    }`} />
                    <div>
                      <div className="text-[9px] font-semibold tracking-wide uppercase text-muted-foreground">
                        System {String.fromCharCode(65 + methodIdx)}
                      </div>
                      <div className="text-[12px] font-bold text-foreground">{method}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isDone && (
                      <span className={`text-[9px] font-bold tracking-wide uppercase rounded-full border px-2.5 py-0.5 ${statusBadgeClass(lookup.type)}`}>
                        {statusLabel(lookup.type)}
                      </span>
                    )}
                    {isIdle && (
                      <button
                        onClick={() => runLookup(methodIdx)}
                        className="bg-background border border-border text-muted-foreground rounded-lg px-3.5 py-1.5 text-[10px] font-bold tracking-wide uppercase cursor-pointer transition-all hover:border-primary hover:text-primary hover:shadow-sm"
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
                  <div className="px-4 pb-3 border-t border-border/50 pt-2.5">
                    <div className="text-[11px] text-muted-foreground/40 select-none blur-[2px] pointer-events-none">
                      {teaser(lookup.text)}
                    </div>
                    <div className="text-[9px] text-muted-foreground/30 mt-0.5 tracking-wide">— Query to reveal</div>
                  </div>
                )}
                {isLoading && (
                  <div className="px-4 pb-3 border-t border-primary/10 pt-2.5">
                    <div className="text-[11px] font-mono text-primary/60 tracking-wide">{msg}</div>
                  </div>
                )}
                {isDone && (
                  <div className="px-4 pb-5 border-t border-border/30 pt-3 animate-fade-in-up">
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
      <div className="px-8 py-4 border-t border-border flex items-center justify-between bg-card">
        <div className="flex gap-2 items-center">
          {ITEMS.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                itemsWithQuery.has(i) ? 'bg-primary' : i === count ? 'bg-foreground' : 'bg-border'
              }`}
            />
          ))}
          <span className="text-[11px] text-muted-foreground tracking-wide ml-1 font-medium">
            {count} of {ITEMS.length} items queried
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={count < 2 || anyLoading}
          className={`bg-primary text-primary-foreground border-none rounded-xl px-8 py-3 font-sans text-xs font-bold tracking-wide uppercase cursor-pointer transition-all active:scale-[0.97] ${
            count >= 2 && !anyLoading
              ? 'opacity-100 hover:bg-primary-light shadow-md hover:shadow-lg'
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
