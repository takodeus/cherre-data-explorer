import { useState, useRef, useCallback } from 'react';
import { ITEMS, LOOKUP_METHODS, LOADING_MESSAGES, type LookupType } from '@/lib/kiosk-data';
import { scanBeep } from '@/lib/kiosk-audio';

interface ResultCard {
  sys: string;
  type: LookupType;
  text: string;
  id: number;
}

interface ItemLookupScreenProps {
  soundOn: boolean;
  onCheckout: () => void;
}

const ItemLookupScreen = ({ soundOn, onCheckout }: ItemLookupScreenProps) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [queriedMethods, setQueriedMethods] = useState<Set<number>[]>(ITEMS.map(() => new Set()));
  const [itemsWithQuery, setItemsWithQuery] = useState<Set<number>>(new Set());
  const [results, setResults] = useState<Record<number, ResultCard[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const cardIdRef = useRef(0);

  const selectItem = useCallback((idx: number) => {
    setCurrentItem(idx);
  }, []);

  const runLookup = useCallback((methodIdx: number) => {
    if (soundOn) scanBeep();
    setLoading(true);
    setLoadingMsg('Querying legacy system…');

    const newQueried = [...queriedMethods];
    newQueried[currentItem] = new Set(newQueried[currentItem]).add(methodIdx);
    setQueriedMethods(newQueried);

    const newItemsWithQuery = new Set(itemsWithQuery).add(currentItem);
    setItemsWithQuery(newItemsWithQuery);

    let mi = 0;
    const msgInterval = setInterval(() => {
      if (mi < LOADING_MESSAGES.length) {
        setLoadingMsg(LOADING_MESSAGES[mi++]);
      }
    }, 280);

    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      clearInterval(msgInterval);
      setLoading(false);
      const lookup = ITEMS[currentItem].lookups[methodIdx];
      const newCard: ResultCard = { ...lookup, id: cardIdRef.current++ };
      setResults(prev => ({
        ...prev,
        [currentItem]: [...(prev[currentItem] || []), newCard],
      }));
      setTimeout(() => {
        if (resultsRef.current) resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
      }, 50);
    }, delay);
  }, [currentItem, queriedMethods, itemsWithQuery, soundOn]);

  const count = itemsWithQuery.size;
  const currentResults = results[currentItem] || [];

  const typeColor = (type: LookupType) => {
    if (type === 'ok') return 'text-primary';
    if (type === 'err') return 'text-destructive';
    return 'text-warning';
  };

  const textStyle = (type: LookupType) => {
    if (type === 'ok') return 'text-foreground';
    if (type === 'err') return 'text-destructive font-mono text-xs';
    return 'text-warning-foreground';
  };

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
          <div className="text-primary-foreground font-extrabold tracking-tight" style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}>
            Select an item. Try all four systems.
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
          {ITEMS.map((item, i) => (
            <button
              key={i}
              onClick={() => selectItem(i)}
              className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-2 text-left w-full transition-all rounded-none ${
                i === currentItem
                  ? 'bg-primary-light-bg border-primary shadow-[3px_3px_0_hsl(var(--primary))]'
                  : 'bg-background border-border hover:border-primary/40 hover:bg-primary-light-bg/50'
              }`}
            >
              <div className="w-10 h-10 rounded-none border-2 border-primary/30 bg-background flex items-center justify-center text-lg flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-[13px] font-bold text-foreground">{item.name}</div>
                <div className="text-[10px] text-muted-foreground font-normal mt-px font-mono">{item.category}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main area */}
        <div className="flex-1 px-8 py-6 overflow-y-auto flex flex-col gap-5 retro-dot-grid" ref={resultsRef}>
          <div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3 font-mono">Lookup method</div>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {LOOKUP_METHODS.map((method, i) => (
                <button
                  key={i}
                  onClick={() => runLookup(i)}
                  disabled={loading}
                  className={`border-2 rounded-none py-2.5 px-2 font-sans text-[11px] font-bold tracking-[0.06em] uppercase text-center cursor-pointer transition-all ${
                    queriedMethods[currentItem]?.has(i)
                      ? 'border-primary bg-primary-light-bg text-primary shadow-[2px_2px_0_hsl(var(--primary))]'
                      : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground hover:shadow-[2px_2px_0_hsl(var(--primary))]'
                  } disabled:opacity-50`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 min-h-[200px]">
            {currentResults.length === 0 && !loading && (
              <div className="text-xs text-muted-foreground italic py-2 font-mono">
                Select a lookup method to query the system…
              </div>
            )}

            {currentResults.map(card => (
              <div key={card.id} className="bg-card border-2 border-border rounded-none px-4 py-3 flex flex-col gap-1.5 animate-fade-in-up shadow-[2px_2px_0_hsl(var(--border))]">
                <div className={`text-[9px] font-bold tracking-[0.18em] uppercase font-mono ${typeColor(card.type)}`}>
                  {card.sys}
                </div>
                <div className={`text-[13px] font-normal leading-relaxed whitespace-pre-line ${textStyle(card.type)}`}>
                  {card.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 px-4 py-3.5 bg-card border-2 border-dashed border-primary/30 rounded-none">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ animation: `pulse-dot 0.8s ease infinite ${i * 0.15}s` }}
                  />
                ))}
                <div className="text-[11px] text-muted-foreground font-mono tracking-wide">{loadingMsg}</div>
              </div>
            )}
          </div>
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
