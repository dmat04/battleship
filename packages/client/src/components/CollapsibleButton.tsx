import { styled, useTheme } from "styled-components";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { animated, easings, useSpring } from "@react-spring/web";
import { Theme } from "./assets/themes/themeDefault.js";
import MenuItemLabel from "./MemuItemLabel.js";
import CollapsibleContainer, {
  CollapsibleAPI,
  CollapsibleState,
} from "./CollapsibleContainer/index.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";

const Container = styled(animated.div)<{ theme: Theme }>`
  width: 100%;
  border: ${(props) => props.theme.borderStyle};
  padding: ${(props) => props.theme.paddingMin};
  overflow: clip;
`;

const ChildrenContainer = styled.div<{ theme: Theme }>`
  width: 100%;
  display: flex;
  margin-top: ${(props) => props.theme.paddingSm};
`;

interface Props {
  label: string;
  onCollapsedStateChange?: (collapsed: CollapsibleState) => void;
  initialState: CollapsibleState;
}

const CollapsibleButton = forwardRef<
  CollapsibleAPI,
  React.PropsWithChildren<Props>
>(
  (
    {
      label,
      onCollapsedStateChange,
      initialState,
      children,
      ...rest
    }: React.PropsWithChildren<Props>,
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const collapsibleRef = useRef<CollapsibleAPI>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);

    const theme = useTheme() as Theme;

    const springCollapsed = useMemo(
      () => ({
        background: theme.colors.containerSecondary,
        color: theme.colors.onContainerSecondary,
      }),
      [theme],
    );

    const springExpanded = useMemo(
      () => ({
        background: theme.colors.containerPrimary,
        color: theme.colors.onContainerPrimary,
      }),
      [theme],
    );

    const [springStyles, springApi] = useSpring(
      () => ({
        from: initialState === "closed" ? springCollapsed : springExpanded,
        config: {
          duration: theme.durationTransitionDefault,
          easing: easings.easeOutCubic,
        },
      }),
      [theme],
    );

    useEffect(() => {
      switch (collapsibleRef.current?.getState()) {
        case "open":
          void springApi.start({ to: springExpanded });
          break;
        default:
          void springApi.start({ to: springCollapsed });
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
      if (ev.target !== containerRef.current && ev.target !== labelRef.current)
        return;

      collapsibleRef.current?.toggleState();
    }, []);

    const interceptCollapsedStateChange = useCallback(
      (state: CollapsibleState) => {
        switch (state) {
          case "open":
            void springApi.start({ to: springExpanded });
            break;
          case "closed":
            void springApi.start({ to: springCollapsed });
            break;
          default:
            assertNever(state);
        }

        if (onCollapsedStateChange) onCollapsedStateChange(state);
      },
      [onCollapsedStateChange, springApi, springCollapsed, springExpanded],
    );

    const handlePointerEnter = useCallback(() => {
      void springApi.start({ to: springExpanded });
    }, [springApi, springExpanded]);

    const handlePointerLeave = useCallback(() => {
      if (collapsibleRef.current?.getState() === "open") return;

      void springApi.start({ to: springCollapsed });
    }, [springApi, springCollapsed]);

    return (
      <Container
        ref={containerRef}
        onClick={onClickHandler}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={springStyles}
        {...rest}
      >
        <MenuItemLabel ref={labelRef}>{label}</MenuItemLabel>
        <CollapsibleContainer
          initialState={initialState}
          onCollapsedStateChange={interceptCollapsedStateChange}
          ref={collapsibleRef}
        >
          <ChildrenContainer>{children}</ChildrenContainer>
        </CollapsibleContainer>
      </Container>
    );
  },
);

export default CollapsibleButton;
