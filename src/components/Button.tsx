import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';
import { assertNever } from '../utils/typeUtils';

export type ButtonVariant = 'primary' | 'warning' | 'danger';

export const Button = styled.button<{ $variant: ButtonVariant, theme: Theme }>`
  --colorBg: ${(props) => {
    switch (props.$variant) {
      case 'primary': return props.theme.colors.containerSuccess;
      case 'warning': return props.theme.colors.containerWarning;
      case 'danger': return props.theme.colors.containerDanger;
      default: return assertNever(props.$variant);
    }
  }};
  --colorContent: ${(props) => {
    switch (props.$variant) {
      case 'primary': return props.theme.colors.onContainerSuccess;
      case 'warning': return props.theme.colors.onContainerWarning;
      case 'danger': return props.theme.colors.onContainerDanger;
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
    filter: saturate(300%);
  }
`;
