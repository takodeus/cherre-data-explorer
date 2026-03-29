import { useState, useCallback } from 'react';
import WelcomeScreen from '@/components/kiosk/WelcomeScreen';
import ItemLookupScreen from '@/components/kiosk/ItemLookupScreen';
import ReconciliationScreen from '@/components/kiosk/ReconciliationScreen';
import ResolutionScreen from '@/components/kiosk/ResolutionScreen';
import ReceiptScreen from '@/components/kiosk/ReceiptScreen';
import { clickBeep, errorTone, successChime, scanBeep, initAudio } from '@/lib/kiosk-audio';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [soundOn, setSoundOn] = useState(false);

  const goTo = useCallback((n: number) => {
    if (soundOn) clickBeep();

    // Flash transition
    const flash = document.getElementById('transition-flash');
    if (flash) {
      flash.style.opacity = '0.15';
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
    goTo(1);
  }, [goTo]);

  return (
    <div className="w-full h-full flex flex-col bg-background relative overflow-hidden">
      {/* Aisle sign */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10" />

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className={`absolute top-5 right-6 z-[100] rounded-[20px] px-3.5 py-1.5 font-sans text-[11px] font-medium tracking-[0.06em] cursor-pointer transition-all ${
          soundOn
            ? 'text-primary-light-bg border border-primary-light/40 bg-primary-light/10'
            : 'text-foreground/50 border border-foreground/15 bg-foreground/[0.08] hover:text-foreground/80 hover:border-foreground/30'
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
        <ItemLookupScreen soundOn={soundOn} onCheckout={() => goTo(3)} />
      </div>
      <div className={`screen ${currentScreen === 3 ? 'active' : ''}`}>
        <ReconciliationScreen onBetterWay={() => goTo(4)} active={currentScreen === 3} />
      </div>
      <div className={`screen ${currentScreen === 4 ? 'active' : ''}`}>
        <ResolutionScreen onTalk={() => goTo(5)} />
      </div>
      <div className={`screen ${currentScreen === 5 ? 'active' : ''}`}>
        <ReceiptScreen onRestart={restart} onBackToCherre={() => goTo(4)} />
      </div>
    </div>
  );
};

export default Index;
