import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';
import { assertNever } from '../utils/typeUtils';

export type FormButtonVariant = 'submit' | 'cancel' | 'skip';

const FormButton = styled.button<{ $variant: FormButtonVariant, theme: Theme }>`
  --colorBg: ${(props) => {
    switch (props.$variant) {
      case 'submit': return props.theme.color700;
      case 'cancel': return props.theme.color700;
      case 'skip': return props.theme.color700;
      default: return assertNever(props.$variant);
    }
  }};
  --colorBgHover: ${(props) => {
    switch (props.$variant) {
      case 'submit': return props.theme.color400;
      case 'cancel': return props.theme.color400;
      case 'skip': return props.theme.color400;
      default: return assertNever(props.$variant);
    }
  }};

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--colorBg);
  border: 2px solid black;
  transition: ${(props) => `all ${props.theme.durationTransitionDefault}ms ease-out`};

  &:hover {
    background-color: var(--colorBgHover);
  }  
`;

export default FormButton;
