import { useCallback, useState } from 'react';
import localStorageUtils from '../utils/localStorageUtils';

const GAME_HINTS = [
  'Place your ships by dragging them onto the grid.',
  'Double-tap a ship to rotate it.',
];

const useGameHint = () => {
  const [hasSeen, setHasSeen] = useState<boolean>(localStorageUtils.hasSeenGameHints());
  const [hintIndex, setHintIndex] = useState<number>(hasSeen ? GAME_HINTS.length : 0);
  const [hint, setHint] = useState<string | null>(hasSeen ? null : GAME_HINTS[hintIndex]);

  const nextHint = useCallback(() => {
    if (hasSeen) return;

    const newHint = hintIndex < GAME_HINTS.length - 1
      ? GAME_HINTS[hintIndex + 1]
      : null;

    const seen = hintIndex === GAME_HINTS.length - 1;
    if (seen) localStorageUtils.setGameHintsSeen();

    setHasSeen(seen);
    setHintIndex(hintIndex + 1);
    setHint(newHint);
  }, [hasSeen, hintIndex]);

  return {
    hint,
    nextHint,
  };
};

export default useGameHint;
