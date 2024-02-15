import styled, { ThemeContext } from 'styled-components';
import React, {
  forwardRef, useCallback, useContext, useImperativeHandle, useRef,
} from 'react';
import {
  animated, easings, useSpring, useSpringValue,
} from '@react-spring/web';
import themeDefault, { Theme } from './assets/themes/themeDefault';
import MenuItemLabel from './MemuItemLabel';

const Container = styled(animated.div) <{ theme: Theme }>`
  width: 100%;
  background-color: ${(props) => props.theme.colorBg};
  border: 2px solid black;
  padding: ${(props) => props.theme.paddingMin};
  overflow: clip;
`;

export type CollapsibleState = 'open' | 'closed';

interface Props {
  label: string;
  // eslint-disable-next-line react/require-default-props
  onCollapsedStateChange?: (collapsed: CollapsibleState) => void;
  // eslint-disable-next-line react/require-default-props
  initialState: CollapsibleState;
}

export interface CollapsibleAPI {
  setState: (collapsed: CollapsibleState) => void;
}

const CollapsibleContainer = forwardRef<CollapsibleAPI, React.PropsWithChildren<Props>>(
  (
    {
      label, onCollapsedStateChange, initialState, children,
    }: React.PropsWithChildren<Props>,
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const childrenContainerRef = useRef<HTMLDivElement>(null);

    const collapsibleState = useRef<CollapsibleState>(initialState);

    const theme = useContext(ThemeContext) ?? themeDefault;

    const backgroundColor = useSpringValue(theme.colorBg, {
      config: {
        duration: theme.durationTransitionDefault,
        easing: easings.easeOutCubic,
      },
    });

    const [springStyle, springAPI] = useSpring(() => ({
      from: { height: '0px', opacity: 0 },
      config: { duration: theme.durationTransitionDefault },
    }));

    const setState = useCallback((collapsed: CollapsibleState) => {
      if (collapsed === collapsibleState.current) return;

      if (collapsibleState.current === 'open') {
        springAPI.start({
          from: {
            height: `${childrenContainerRef.current?.offsetHeight ?? 0}px`,
            opacity: 1,
          },
          to: {
            height: '0px', opacity: 0,
          },
        });
        backgroundColor.start(theme.colorBg);
      } else {
        springAPI.start({
          from: {
            height: '0px', opacity: 0,
          },
          to: {
            height: `${childrenContainerRef.current?.offsetHeight ?? 0}px`,
            opacity: 1,
          },
        });
        backgroundColor.start(theme.colorSecondary);
      }

      collapsibleState.current = collapsed;

      if (onCollapsedStateChange) onCollapsedStateChange(collapsibleState.current);
    }, [backgroundColor, onCollapsedStateChange, springAPI, theme.colorBg, theme.colorSecondary]);

    useImperativeHandle(ref, () => ({
      setState,
    }));

    const onClickHandler = (ev: React.MouseEvent) => {
      if (ev.target !== containerRef.current
        && ev.target !== labelRef.current) return;

      setState(collapsibleState.current === 'open' ? 'closed' : 'open');
    };

    return (
      <Container
        ref={containerRef}
        onClick={onClickHandler}
        onPointerEnter={() => backgroundColor.start(theme.colorSecondary)}
        onPointerLeave={() => collapsibleState.current && backgroundColor.start(theme.colorBg)}
        style={{ backgroundColor }}
      >
        <MenuItemLabel ref={labelRef}>{label}</MenuItemLabel>
        <animated.div style={springStyle}>
          <div ref={childrenContainerRef}>
            {children}
          </div>
        </animated.div>
      </Container>
    );
  },
);

export default CollapsibleContainer;
