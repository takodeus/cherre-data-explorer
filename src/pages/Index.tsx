import { useState, useCallback } from 'react';
import WelcomeScreen from '@/components/kiosk/WelcomeScreen';
import ItemLookupScreen from '@/components/kiosk/ItemLookupScreen';
import ReconciliationScreen from '@/components/kiosk/ReconciliationScreen';
import ResolutionScreen from '@/components/kiosk/ResolutionScreen';
import ReceiptScreen from '@/components/kiosk/ReceiptScreen';
import { ITEMS } from '@/lib/kiosk-data';
import { clickBeep, errorTone, successChime, scanBeep, initAudio } from '@/lib/kiosk-audio';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [soundOn, setSoundOn] = useState(false);
  const [itemsWithQuery, setItemsWithQuery] = useState<Set<number>>(new Set());
  const [queriedMethods, setQueriedMethods] = useState<Set<number>[]>(ITEMS.map(() => new Set()));

  const goTo = useCallback((n: number) => {
    if (soundOn) clickBeep();

    const flash = document.getElementById('transition-flash');
    if (flash) {
      flash.style.opacity = '0.12';
      setTimeout(() => { flash.style.opacity = '0'; }, 150);
    }

    setCurrentScreen(n);

    if (n === 3 && soundOn) errorTone();
    if (n === 4 && soundOn) successChime();
    if (n === 5 && soundOn) scanBeep();
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      if (!prev) initAudio();
      return !prev;
    });
  }, []);

  const restart = useCallback(() => {
    setItemsWithQuery(new Set());
    setQueriedMethods(ITEMS.map(() => new Set()));
    goTo(1);
  }, [goTo]);

  return (
    <div className="w-full h-full flex flex-col bg-background relative overflow-hidden">
      {/* Aisle sign - retro stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className={`absolute top-5 right-6 z-[100] rounded-none px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.08em] cursor-pointer transition-all border-2 ${
          soundOn
            ? 'text-primary border-primary bg-primary-light-bg shadow-[2px_2px_0_hsl(var(--primary))]'
            : 'text-muted-foreground border-border bg-background hover:text-foreground hover:border-primary shadow-[2px_2px_0_hsl(var(--border))]'
        }`}
      >
        {soundOn ? 'SOUND ON' : 'SOUND OFF'}
      </button>

      {/* Transition flash */}
      <div
        id="transition-flash"
        className="fixed inset-0 bg-foreground pointer-events-none z-[200] transition-opacity duration-150"
        style={{ opacity: 0 }}
      />

      {/* Screens */}
      <div className={`screen ${currentScreen === 1 ? 'active' : ''}`}>
        <WelcomeScreen onStart={() => goTo(2)} />
      </div>
      <div className={`screen ${currentScreen === 2 ? 'active' : ''}`}>
        <ItemLookupScreen
          soundOn={soundOn}
          itemsWithQuery={itemsWithQuery}
          setItemsWithQuery={setItemsWithQuery}
          queriedMethods={queriedMethods}
          setQueriedMethods={setQueriedMethods}
          onCheckout={() => goTo(3)}
        />
      </div>
      <div className={`screen ${currentScreen === 3 ? 'active' : ''}`}>
        <ReconciliationScreen onBetterWay={() => goTo(4)} active={currentScreen === 3} />
      </div>
      <div className={`screen ${currentScreen === 4 ? 'active' : ''}`}>
        <ResolutionScreen onTalk={() => goTo(5)} />
      </div>
      <div className={`screen ${currentScreen === 5 ? 'active' : ''}`}>
        <ReceiptScreen
          onRestart={restart}
          onBackToCherre={() => goTo(4)}
          itemsWithQuery={itemsWithQuery}
          queriedMethods={queriedMethods}
        />
      </div>
    </div>
  );
};

export default Index;
