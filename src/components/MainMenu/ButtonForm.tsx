import styled from 'styled-components';
import { useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  background-color: white;
  border: 2px solid black;
  padding: ${(props) => props.theme.paddingMin};
  width: 20rem;

  &:hover {
    background-color: ${(props) => props.theme.colorBg};
  }

  transition: background-color 200ms ease-out;
`;

interface Props {
  label: string;
}

const ButtonForm = ({ label }: Props) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLElement | null>(null);

  const isCollapsed = useRef<boolean>(true);

  const collapsedConfig = {
    opacity: 0,
    maxHeight: '0px',
  };

  const expandedConfig = {
    opacity: 1,
    maxHeight: '150px',
  };

  const [springStyle, springAPI] = useSpring(() => ({
    from: collapsedConfig,
    config: { duration: 300 },
  }));

  const onClickHandler = (ev: React.MouseEvent) => {
    if (ev.target !== containerRef.current
      && ev.target !== labelRef.current) return;

    let from = collapsedConfig;
    let to = expandedConfig;

    if (isCollapsed.current === false) {
      from = expandedConfig;
      to = collapsedConfig;
    }

    isCollapsed.current = !isCollapsed.current;
    springAPI.start({ from, to });
  };

  return (
    <Container
      ref={containerRef}
      onClick={onClickHandler}
    >
      <p ref={labelRef}>{label}</p>
      <animated.div style={springStyle}>
        <form>
          <input type="text" placeholder="hello" />
          <input type="text" placeholder="hello" />
          <input type="text" placeholder="hello" />
          <input type="text" placeholder="hello" />
          <input type="text" placeholder="hello" />
        </form>
      </animated.div>
    </Container>
  );
};

export default ButtonForm;
