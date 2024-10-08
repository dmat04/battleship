import { styled, ThemeContext } from "styled-components";
import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { animated, useSpring } from "@react-spring/web";
import themeDefault from "../assets/themes/themeDefault.js";

const Container = styled(animated.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: clip;
`;

export type CollapsibleState = "open" | "closed";

interface Props {
  onCollapsedStateChange?: (state: CollapsibleState) => void;
  initialState?: CollapsibleState;
}

export interface CollapsibleAPI {
  getState: () => CollapsibleState;
  setState: (collapsed: CollapsibleState) => void;
  toggleState: () => CollapsibleState;
}

const CollapsibleContainer = forwardRef<
  CollapsibleAPI,
  React.PropsWithChildren<Props>
>(
  (
    {
      onCollapsedStateChange,
      initialState = "closed",
      children,
    }: React.PropsWithChildren<Props>,
    ref,
  ) => {
    const childrenContainerRef = useRef<HTMLDivElement>(null);
    const collapsibleState = useRef<CollapsibleState>(initialState);

    const theme = useContext(ThemeContext) ?? themeDefault;

    const [springStyle, springAPI] = useSpring(() => ({
      from: {
        height:
          initialState === "closed"
            ? "0px"
            : `${childrenContainerRef.current?.offsetHeight}px`,
        opacity: initialState === "closed" ? 0 : 1,
      },
      config: { duration: theme.durationTransitionDefault },
    }));

    const getState = useCallback(() => collapsibleState.current, []);

    const setState = useCallback(
      (collapsed: CollapsibleState) => {
        if (collapsed === collapsibleState.current) return;

        if (collapsibleState.current === "open") {
          void springAPI.start({
            from: {
              height: `${childrenContainerRef.current?.offsetHeight ?? 0}px`,
              opacity: 1,
            },
            to: {
              height: "0px",
              opacity: 0,
            },
          });
        } else {
          void springAPI.start({
            from: {
              height: "0px",
              opacity: 0,
            },
            to: {
              height: `${childrenContainerRef.current?.offsetHeight ?? 0}px`,
              opacity: 1,
            },
          });
        }

        collapsibleState.current = collapsed;

        if (onCollapsedStateChange)
          onCollapsedStateChange(collapsibleState.current);
      },
      [onCollapsedStateChange, springAPI],
    );

    const toggleState = useCallback(() => {
      setState(collapsibleState.current === "open" ? "closed" : "open");
      return collapsibleState.current;
    }, [setState]);

    useImperativeHandle(ref, () => ({
      getState,
      setState,
      toggleState,
    }));

    return (
      <Container style={springStyle}>
        <Container ref={childrenContainerRef}>{children}</Container>
      </Container>
    );
  },
);

export default CollapsibleContainer;
