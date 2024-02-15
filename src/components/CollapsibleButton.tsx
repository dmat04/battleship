import styled, { ThemeContext } from 'styled-components';
import React, {
  forwardRef, useCallback, useContext, useImperativeHandle, useRef,
} from 'react';
import {
  animated, easings, useSpringValue,
} from '@react-spring/web';
import themeDefault, { Theme } from './assets/themes/themeDefault';
import MenuItemLabel from './MemuItemLabel';
import CollapsibleContainer, { CollapsibleAPI, CollapsibleState } from './CollapsibleContainer';

const Container = styled(animated.div) <{ theme: Theme }>`
  width: 100%;
  background-color: ${(props) => props.theme.colorBg};
  border: 2px solid black;
  padding: ${(props) => props.theme.paddingMin};
  overflow: clip;
`;

interface Props {
  label: string;
  // eslint-disable-next-line react/require-default-props
  onCollapsedStateChange?: (collapsed: CollapsibleState) => void;
  // eslint-disable-next-line react/require-default-props
  initialState: CollapsibleState;
}

const CollapsibleButton = forwardRef<CollapsibleAPI, React.PropsWithChildren<Props>>(
  (
    {
      label, onCollapsedStateChange, initialState, children,
    }: React.PropsWithChildren<Props>,
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const collapsibleRef = useRef<CollapsibleAPI>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);

    const theme = useContext(ThemeContext) ?? themeDefault;

    const backgroundColor = useSpringValue(theme.colorBg, {
      config: {
        duration: theme.durationTransitionDefault,
        easing: easings.easeOutCubic,
      },
    });

    // eslint-disable-next-line arrow-body-style
    const getState = useCallback(() => {
      return collapsibleRef.current?.getState() ?? initialState;
    }, [initialState]);

    const setState = useCallback((collapsed: CollapsibleState) => {
      collapsibleRef.current?.setState(collapsed);
    }, []);

    // eslint-disable-next-line arrow-body-style
    const toggleState = useCallback(() => {
      return collapsibleRef.current?.toggleState() ?? initialState;
    }, [initialState]);

    useImperativeHandle(ref, () => ({
      getState,
      setState,
      toggleState,
    }));

    const onClickHandler = useCallback((ev: React.MouseEvent) => {
      if (ev.target !== containerRef.current
        && ev.target !== labelRef.current) return;

      collapsibleRef.current?.toggleState();
    }, []);

    const interceptCollapsedStateChange = useCallback((state: CollapsibleState) => {
      if (state === 'closed') backgroundColor.start(theme.colorBg);
      if (onCollapsedStateChange) onCollapsedStateChange(state);
    }, [backgroundColor, onCollapsedStateChange, theme.colorBg]);

    const handlePointerEnter = useCallback(() => {
      backgroundColor.start(theme.colorSecondary);
    }, [backgroundColor, theme.colorSecondary]);

    const handlePointerLeave = useCallback(() => {
      if (collapsibleRef.current?.getState() === 'open') return;

      backgroundColor.start(theme.colorBg);
    }, [backgroundColor, theme.colorBg]);

    return (
      <Container
        ref={containerRef}
        onClick={onClickHandler}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{ backgroundColor }}
      >
        <MenuItemLabel ref={labelRef}>{label}</MenuItemLabel>
        <CollapsibleContainer
          initialState={initialState}
          onCollapsedStateChange={interceptCollapsedStateChange}
          ref={collapsibleRef}
        >
          {children}
        </CollapsibleContainer>
      </Container>
    );
  },
);

export default CollapsibleButton;
