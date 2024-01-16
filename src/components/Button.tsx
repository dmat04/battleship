import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';
import { assertNever } from '../utils/typeUtils';

export type ButtonVariant = 'primary' | 'warning' | 'danger';

const Button = styled.button<{ $variant: ButtonVariant, theme: Theme }>`
  --colorBg: ${(props) => {
    switch (props.$variant) {
      case 'primary': return props.theme.colorBg;
      case 'warning': return props.theme.colorSecondary;
      case 'danger': return props.theme.colorBg;
      default: return assertNever(props.$variant);
    }
  }};
  --colorBgHover: ${(props) => {
    switch (props.$variant) {
      case 'primary': return props.theme.colorPrimary;
      case 'warning': return props.theme.colorPrimary;
      case 'danger': return props.theme.colorPrimary;
      default: return assertNever(props.$variant);
    }
  }};

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--colorBg);
  border: 2px solid black;
  transition: ${(props) => `all ${props.theme.durationTransitionDefault}ms ease-out`};

  padding: ${(props) => props.theme.paddingMin};
  width: 20rem;


  &:hover {
    background-color: var(--colorBgHover);
  }
`;

export default Button;
