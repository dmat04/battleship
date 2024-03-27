import styled, { useTheme } from 'styled-components';
import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef,
} from 'react';
import {
  animated, easings, useSpring,
} from '@react-spring/web';
import { Theme } from './assets/themes/themeDefault';
import MenuItemLabel from './MemuItemLabel';
import CollapsibleContainer, { CollapsibleAPI, CollapsibleState } from './CollapsibleContainer';
import { assertNever } from '../utils/typeUtils';

const Container = styled(animated.div) <{ theme: Theme }>`
  width: 100%;
  border: ${(props) => props.theme.borderStyle};
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

    const theme = useTheme() as Theme;

    const springCollapsed = useMemo(() => ({
      background: theme.colors.containerSecondary,
      color: theme.colors.onContainerSecondary,
    }), [theme]);

    const springExpanded = useMemo(() => ({
      background: theme.colors.containerPrimary,
      color: theme.colors.onContainerPrimary,
    }), [theme]);

    const [springStyles, springApi] = useSpring(() => ({
      from: initialState === 'closed' ? springCollapsed : springExpanded,
      config: {
        duration: theme.durationTransitionDefault,
        easing: easings.easeOutCubic,
      },
    }), [theme]);

    useEffect(() => {
      switch (collapsibleRef.current?.getState()) {
        case 'open': springApi.start({ to: springExpanded }); break;
        default: springApi.start({ to: springCollapsed });
      }
    }, [theme, springApi, springCollapsed, springExpanded]);

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
      switch (state) {
        case 'open': springApi.start({ to: springExpanded }); break;
        case 'closed': springApi.start({ to: springCollapsed }); break;
        default: assertNever(state);
      }

      if (onCollapsedStateChange) onCollapsedStateChange(state);
    }, [onCollapsedStateChange, springApi, springCollapsed, springExpanded]);

    const handlePointerEnter = useCallback(() => {
      springApi.start({ to: springExpanded });
    }, [springApi, springExpanded]);

    const handlePointerLeave = useCallback(() => {
      if (collapsibleRef.current?.getState() === 'open') return;

      springApi.start({ to: springCollapsed });
    }, [springApi, springCollapsed]);

    return (
      <Container
        ref={containerRef}
        onClick={onClickHandler}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={springStyles}
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
