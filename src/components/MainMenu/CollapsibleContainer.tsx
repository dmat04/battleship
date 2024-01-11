import styled, { ThemeContext } from 'styled-components';
import React, {
  forwardRef, useCallback, useContext, useImperativeHandle, useRef,
} from 'react';
import {
  animated, easings, useSpring, useSpringValue,
} from '@react-spring/web';
import themeDefault, { Theme } from '../assets/themes/themeDefault';

const Container = styled(animated.div) <{ theme: Theme }>`
  background-color: ${(props) => props.theme.colorBg};
  border: 2px solid black;
  padding: ${(props) => props.theme.paddingMin};
  width: 20rem;
  overflow: clip;
`;

const Label = styled.p<{ theme: Theme }>`
  font-size: large;
  font-weight: bolder;
  text-align: center;
`;

interface Props {
  label: string;
  // eslint-disable-next-line react/require-default-props
  onClick?: (collapsed: boolean) => void;
}

export interface CollapsibleAPI {
  setCollapsed: (collapsed: boolean) => void;
}

const CollapsibleContainer = forwardRef<CollapsibleAPI, React.PropsWithChildren<Props>>(
  ({ label, onClick, children }: React.PropsWithChildren<Props>, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const childrenContainerRef = useRef<HTMLDivElement>(null);

    const isCollapsed = useRef<boolean>(true);

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

    const setCollapsed = useCallback((collapsed: boolean) => {
      if (collapsed === isCollapsed.current) return;

      isCollapsed.current = collapsed;

      if (isCollapsed.current) {
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
    }, [backgroundColor, springAPI, theme.colorBg, theme.colorSecondary]);

    useImperativeHandle(ref, () => ({
      setCollapsed,
    }));

    const onClickHandler = (ev: React.MouseEvent) => {
      if (ev.target !== containerRef.current
        && ev.target !== labelRef.current) return;

      setCollapsed(!isCollapsed.current);
      if (onClick) onClick(isCollapsed.current);
    };

    return (
      <Container
        ref={containerRef}
        onClick={onClickHandler}
        onPointerEnter={() => backgroundColor.start(theme.colorSecondary)}
        onPointerLeave={() => isCollapsed.current && backgroundColor.start(theme.colorBg)}
        style={{ backgroundColor }}
      >
        <Label ref={labelRef}>{label}</Label>
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
