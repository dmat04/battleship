import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';
import { assertNever } from '../../utils/typeUtils';

export type FormButtonVariant = 'submit' | 'cancel' | 'skip';

const FormButton = styled.button<{ $variant: FormButtonVariant, theme: Theme }>`
  --colorBg: ${(props) => {
    switch (props.$variant) {
      case 'submit': return props.theme.colorPrimary;
      case 'cancel': return props.theme.colorSecondary;
      case 'skip': return props.theme.colorBg;
      default: return assertNever(props.$variant);
    }
  }};
  --colorBgHover: ${(props) => {
    switch (props.$variant) {
      case 'submit': return props.theme.colorBg;
      case 'cancel': return props.theme.colorPrimary;
      case 'skip': return props.theme.colorPrimary;
      default: return assertNever(props.$variant);
    }
  }};
  
  background-color: var(--colorBg);
  border: 2px solid black;
  padding: ${(props) => props.theme.paddingMin};
  transition: ${(props) => `all ${props.theme.durationTransitionDefault}ms ease-out`};

  &:hover {
    background-color: var(--colorBgHover);
  }  
`;

export default FormButton;
