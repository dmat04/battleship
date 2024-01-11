import styled from 'styled-components';
import React, {
  forwardRef, useCallback, useImperativeHandle, useRef,
} from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  background-color: white;
  border: 2px solid black;
  padding: ${(props) => props.theme.paddingMin};
  width: 20rem;
  overflow: clip;

  &:hover {
    background-color: ${(props) => props.theme.colorBg};
  }

  transition: background-color 200ms ease-out;
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

export interface ButtonFormAPI {
  setCollapsed: (collapsed: boolean) => void;
}

const ButtonForm = forwardRef<ButtonFormAPI, React.PropsWithChildren<Props>>(
  ({ label, onClick, children }: React.PropsWithChildren<Props>, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const childrenContainerRef = useRef<HTMLDivElement>(null);

    const isCollapsed = useRef<boolean>(true);

    const [springStyle, springAPI] = useSpring(() => ({
      from: { height: '0px', opacity: 0 },
      config: { duration: 300 },
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
      }
    }, [springAPI]);

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

export default ButtonForm;
