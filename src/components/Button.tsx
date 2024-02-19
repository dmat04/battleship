import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';
import { assertNever } from '../utils/typeUtils';

export type ButtonVariant = 'primary' | 'warning' | 'danger';

export const Button = styled.button<{ $variant: ButtonVariant, theme: Theme }>`
  --colorBg: ${(props) => {
    switch (props.$variant) {
      case 'primary': return props.theme.color700;
      case 'warning': return props.theme.color700;
      case 'danger': return props.theme.color700;
      default: return assertNever(props.$variant);
    }
  }};
  --colorBgHover: ${(props) => {
    switch (props.$variant) {
      case 'primary': return props.theme.color400;
      case 'warning': return props.theme.color400;
      case 'danger': return props.theme.color400;
      default: return assertNever(props.$variant);
    }
  }};

  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--colorBg);
  border: 2px solid black;
  transition: ${(props) => `all ${props.theme.durationTransitionDefault}ms ease-out`};

  padding: ${(props) => props.theme.paddingMin};

  &:hover {
    background-color: var(--colorBgHover);
  }
`;
