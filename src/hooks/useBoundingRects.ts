import { useEffect, useState } from 'react';

const useBoundingRects = (
  containerRef: React.MutableRefObject<HTMLElement | null>,
  gridRef: React.MutableRefObject<HTMLElement | null>,
) => {
  const [viewport, setViewport] = useState<VisualViewport | null>(window.visualViewport);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(
    containerRef.current?.getBoundingClientRect() ?? null,
  );
  const [gridRect, setGridRect] = useState<DOMRect | null>(
    gridRef.current?.getBoundingClientRect() ?? null,
  );

  useEffect(() => {
    const onResize = () => {
      setViewport(window.visualViewport);
      setContainerRect(containerRef.current?.getBoundingClientRect() ?? null);
      setGridRect(gridRef.current?.getBoundingClientRect() ?? null);
    };

    onResize();

    window.visualViewport?.addEventListener('resize', onResize);
    return () => window.visualViewport?.removeEventListener('resize', onResize);
  }, [containerRef, gridRef]);

  return {
    viewport,
    containerRect,
    gridRect,
  };
};

export default useBoundingRects;
