import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WelcomeScreen from '@/components/kiosk/WelcomeScreen';
import ItemLookupScreen from '@/components/kiosk/ItemLookupScreen';
import ReconciliationScreen from '@/components/kiosk/ReconciliationScreen';
import ResolutionScreen from '@/components/kiosk/ResolutionScreen';
import ReceiptScreen from '@/components/kiosk/ReceiptScreen';
import StepperBar from '@/components/kiosk/StepperBar';
import { ITEMS } from '@/lib/kiosk-data';
import { clickBeep, errorTone, successChime, scanBeep, initAudio } from '@/lib/kiosk-audio';

const TRANSITION_MS = 340;
const SCREEN_MIN = 1;
const SCREEN_MAX = 5;

function clampScreen(v: string | null): number {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) && n >= SCREEN_MIN && n <= SCREEN_MAX ? n : 1;
}

function clampItem(v: string | null): number {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) && n >= 0 && n < ITEMS.length ? n : 0;
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialise from URL on first render; URL is the source of truth for these two
  // Screen 5 requires session state — redirect to 1 if accessed cold via deep-link
  const [currentScreen, setCurrentScreen] = useState<number>(() => {
    const s = clampScreen(searchParams.get('screen'));
    return s === 5 ? 1 : s;
  });
  const [currentItem,   setCurrentItem]   = useState<number>(() => clampItem(searchParams.get('item')));

  const [direction,      setDirection]      = useState<'forward' | 'back'>('forward');
  const [soundOn,        setSoundOn]        = useState(false);
  const [itemsWithQuery, setItemsWithQuery] = useState<Set<number>>(new Set());
  const [queriedMethods, setQueriedMethods] = useState<Set<number>[]>(ITEMS.map(() => new Set()));

  const prevScreenRef  = useRef(currentScreen);
  const transitioning  = useRef(false);
  // Counter instead of boolean — handles concurrent pushes correctly
  const internalNavRef = useRef(0);

  // ── Push state → URL ──────────────────────────────────────────────────────
  const pushParams = useCallback((screen: number, item: number) => {
    internalNavRef.current++;
    const next: Record<string, string> = { screen: String(screen) };
    // Only include item param on the lookup screen; omit elsewhere to keep URLs clean
    if (screen === 2) next.item = String(item);
    setSearchParams(next, { replace: false });
  }, [setSearchParams]);

  // ── React to browser back/forward (URL → state) ───────────────────────────
  useEffect(() => {
    // Skip the first render (we already initialised from URL) and our own pushes
    if (internalNavRef.current > 0) {
      internalNavRef.current--;
      return;
    }

    const newScreen = clampScreen(searchParams.get('screen'));
    const newItem   = clampItem(searchParams.get('item'));

    if (newScreen === currentScreen && newItem === currentItem) return;

    // Determine direction for animation
    const dir = newScreen > prevScreenRef.current ? 'forward' : 'back';
    setDirection(dir);

    // Animate out the current screen
    const outgoingEl = document.querySelector(`[data-screen="${prevScreenRef.current}"]`);
    if (outgoingEl) {
      outgoingEl.classList.add('exiting');
      outgoingEl.setAttribute('data-exit-dir', dir);
      setTimeout(() => {
        outgoingEl.classList.remove('exiting');
        outgoingEl.removeAttribute('data-exit-dir');
      }, TRANSITION_MS);
    }

    prevScreenRef.current = newScreen;
    setCurrentScreen(newScreen);
    setCurrentItem(newItem);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── goTo: internal navigation ─────────────────────────────────────────────
  const goTo = useCallback((n: number) => {
    if (transitioning.current) return;
    if (soundOn) clickBeep();

    const dir = n > prevScreenRef.current ? 'forward' : 'back';
    setDirection(dir);

    const outgoingEl = document.querySelector(`[data-screen="${prevScreenRef.current}"]`);
    if (outgoingEl) {
      outgoingEl.classList.add('exiting');
      outgoingEl.setAttribute('data-exit-dir', dir);
    }

    transitioning.current = true;
    setTimeout(() => {
      if (outgoingEl) {
        outgoingEl.classList.remove('exiting');
        outgoingEl.removeAttribute('data-exit-dir');
      }
      transitioning.current = false;
    }, TRANSITION_MS);

    prevScreenRef.current = n;
    setCurrentScreen(n);
    pushParams(n, currentItem);

    if (n === 3 && soundOn) errorTone();
    if (n === 4 && soundOn) successChime();
    if (n === 5 && soundOn) scanBeep();
  }, [soundOn, currentItem, pushParams]);

  // ── Item selection ────────────────────────────────────────────────────────
  const selectItem = useCallback((idx: number) => {
    setCurrentItem(idx);
    pushParams(currentScreen, idx);
  }, [currentScreen, pushParams]);

  // ── Other handlers ────────────────────────────────────────────────────────
  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      if (!prev) initAudio();
      return !prev;
    });
  }, []);

  const restart = useCallback(() => {
    setItemsWithQuery(new Set());
    setQueriedMethods(ITEMS.map(() => new Set()));
    setCurrentItem(0);
    goTo(1);
  }, [goTo]);

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-hidden">
      <StepperBar currentScreen={currentScreen} />

      <button
        onClick={toggleSound}
        className={`absolute top-[9px] right-6 z-[100] rounded-full px-3.5 py-1.5 text-[10px] font-bold tracking-wide cursor-pointer transition-all border ${
          soundOn
            ? 'text-primary border-primary/30 bg-primary-light-bg'
            : 'text-muted-foreground border-border bg-background hover:text-foreground hover:border-primary/30'
        }`}
      >
        {soundOn ? 'SOUND ON' : 'SOUND OFF'}
      </button>

      <div className="flex-1 relative overflow-hidden">
        <div data-screen="1" className={`screen ${currentScreen === 1 ? `active enter-${direction}` : ''}`}>
          <WelcomeScreen onStart={() => goTo(2)} active={currentScreen === 1} />
        </div>
        <div data-screen="2" className={`screen ${currentScreen === 2 ? `active enter-${direction}` : ''}`}>
          <ItemLookupScreen
            soundOn={soundOn}
            currentItem={currentItem}
            onSelectItem={selectItem}
            itemsWithQuery={itemsWithQuery}
            setItemsWithQuery={setItemsWithQuery}
            queriedMethods={queriedMethods}
            setQueriedMethods={setQueriedMethods}
            onCheckout={() => goTo(3)}
          />
        </div>
        <div data-screen="3" className={`screen ${currentScreen === 3 ? `active enter-${direction}` : ''}`}>
          <ReconciliationScreen onBetterWay={() => goTo(4)} active={currentScreen === 3} />
        </div>
        <div data-screen="4" className={`screen ${currentScreen === 4 ? `active enter-${direction}` : ''}`}>
          <ResolutionScreen onTalk={() => goTo(5)} />
        </div>
        <div data-screen="5" className={`screen ${currentScreen === 5 ? `active enter-${direction}` : ''}`}>
          <ReceiptScreen
            onRestart={restart}
            onBackToCherre={() => goTo(4)}
            itemsWithQuery={itemsWithQuery}
            queriedMethods={queriedMethods}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
