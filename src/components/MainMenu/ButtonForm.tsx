import styled from 'styled-components';
import { useRef } from 'react';
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

interface Props {
  label: string;
}

const ButtonForm = ({ label, children }: React.PropsWithChildren<Props>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const childrenContainerRef = useRef<HTMLDivElement>(null);

  const isCollapsed = useRef<boolean>(true);

  const [springStyle, springAPI] = useSpring(() => ({
    from: { height: '0px', opacity: 0 },
    config: { duration: 300 },
  }));

  const onClickHandler = (ev: React.MouseEvent) => {
    if (ev.target !== containerRef.current
      && ev.target !== labelRef.current) return;

    if (isCollapsed.current === true) {
      springAPI.start({
        from: {
          height: '0px', opacity: 0,
        },
        to: {
          height: `${childrenContainerRef.current?.offsetHeight ?? 0}px`,
          opacity: 1,
        },
      });
    } else {
      springAPI.start({
        from: {
          height: `${childrenContainerRef.current?.offsetHeight ?? 0}px`,
          opacity: 1,
        },
        to: {
          height: '0px', opacity: 0,
        },
      });
    }

    isCollapsed.current = !isCollapsed.current;
  };

  return (
    <Container
      ref={containerRef}
      onClick={onClickHandler}
    >
      <p ref={labelRef}>{label}</p>
      <animated.div style={springStyle}>
        <div ref={childrenContainerRef}>
          {children}
        </div>
      </animated.div>
    </Container>
  );
};

export default ButtonForm;
