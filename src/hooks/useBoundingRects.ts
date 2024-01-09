import { useEffect, useState } from 'react';

const useBoundingRects = (
  refs: React.MutableRefObject<HTMLElement | null>[],
  dependencies: React.DependencyList,
) => {
  const [rects, setRects] = useState<(DOMRect | null)[]>(Array(refs.length).fill(null));

  useEffect(() => {
    const updateRects = () => {
      setRects(refs.map((ref) => ref.current?.getBoundingClientRect() ?? null));
    };

    updateRects();

    window.visualViewport?.addEventListener('resize', updateRects);
    window.addEventListener('scrollend', updateRects);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateRects);
      window.removeEventListener('scrollend', updateRects);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rects;
};

export default useBoundingRects;
