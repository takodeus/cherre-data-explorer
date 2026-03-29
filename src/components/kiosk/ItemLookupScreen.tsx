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
  const [queriedMethods, setQueriedMethods] = useState<Set<number>[]>([new Set(), new Set(), new Set()]);
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
    if (type === 'err') return 'text-destructive/70 font-mono text-xs';
    return 'text-warning-foreground';
  };

  return (
    <div className="flex flex-col" style={{ position: 'absolute', inset: 0, background: '#0e0e0e' }}>
      {/* Header */}
      <div className="bg-primary px-10 pt-7 pb-5 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary-foreground/60 mb-1">
            Self-checkout — Item Lookup
          </div>
          <div className="text-primary-foreground font-extrabold tracking-tight" style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}>
            Select an item. Try all four systems.
          </div>
        </div>
        <div className="text-[11px] font-semibold tracking-[0.08em] text-primary-foreground/50 text-right">
          Step 2 of 5
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Items column */}
        <div className="w-[200px] flex-shrink-0 border-r border-foreground/[0.06] py-6 flex flex-col">
          {ITEMS.map((item, i) => (
            <button
              key={i}
              onClick={() => selectItem(i)}
              className={`flex items-center gap-3.5 px-6 py-4 cursor-pointer border-none text-left w-full transition-all border-l-[3px] ${
                i === currentItem
                  ? 'bg-primary/15 border-l-primary'
                  : 'bg-transparent border-l-transparent hover:bg-primary/[0.08]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-base flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-foreground tracking-wide">{item.name}</div>
                <div className="text-[10px] text-muted-foreground font-normal mt-px">{item.category}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main area */}
        <div className="flex-1 px-9 py-7 overflow-y-auto flex flex-col gap-5" ref={resultsRef}>
          <div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted mb-3">Lookup method</div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {LOOKUP_METHODS.map((method, i) => (
                <button
                  key={i}
                  onClick={() => runLookup(i)}
                  disabled={loading}
                  className={`bg-foreground/[0.04] border rounded-md py-2.5 px-2 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase text-center cursor-pointer transition-all ${
                    queriedMethods[currentItem]?.has(i)
                      ? 'border-primary/40 text-foreground/60 bg-primary/[0.06]'
                      : 'border-foreground/[0.08] text-muted-foreground hover:border-primary hover:text-foreground hover:bg-primary/10'
                  } disabled:opacity-50`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 min-h-[200px]">
            {currentResults.length === 0 && !loading && (
              <div className="text-xs text-muted-foreground/70 italic py-2">
                Select a lookup method to query the system…
              </div>
            )}

            {currentResults.map(card => (
              <div key={card.id} className="bg-foreground/[0.03] border border-foreground/[0.06] rounded-lg px-4.5 py-3.5 flex flex-col gap-1.5 animate-fade-in-up">
                <div className={`text-[9px] font-bold tracking-[0.18em] uppercase ${typeColor(card.type)}`}>
                  {card.sys}
                </div>
                <div className={`text-[13px] font-normal leading-relaxed whitespace-pre-line ${textStyle(card.type)}`}>
                  {card.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 px-4.5 py-4 bg-foreground/[0.02] border border-foreground/[0.04] rounded-lg">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    style={{ animation: `pulse-dot 0.8s ease infinite ${i * 0.15}s` }}
                  />
                ))}
                <div className="text-[11px] text-muted font-mono tracking-wide">{loadingMsg}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-9 py-4 border-t border-foreground/[0.05] flex items-center justify-between bg-background/40">
        <div className="flex gap-2 items-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < count ? 'bg-primary' : i === count ? 'bg-foreground' : 'bg-foreground/10'
              }`}
            />
          ))}
          <span className="text-[11px] text-muted tracking-[0.06em] ml-1">
            {count} of 3 items queried
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={count < 2}
          className={`bg-primary text-primary-foreground border-none rounded px-8 py-3 font-sans text-xs font-bold tracking-[0.1em] uppercase cursor-pointer transition-all active:scale-[0.97] ${
            count >= 2 ? 'opacity-100 hover:bg-primary-light' : 'opacity-30 pointer-events-none'
          }`}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
};

export default ItemLookupScreen;
