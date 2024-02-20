import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';
import { assertNever } from '../utils/typeUtils';

export type FormButtonVariant = 'submit' | 'cancel' | 'skip';

const FormButton = styled.button<{ $variant: FormButtonVariant, theme: Theme }>`
  --colorBg: ${(props) => {
    switch (props.$variant) {
      case 'submit': return props.theme.colors.containerSuccess;
      case 'cancel': return props.theme.colors.containerDanger;
      case 'skip': return props.theme.colors.containerWarning;
      default: return assertNever(props.$variant);
    }
  }};

--colorContent: ${(props) => {
    switch (props.$variant) {
      case 'submit': return props.theme.colors.onContainerSuccess;
      case 'cancel': return props.theme.colors.onContainerDanger;
      case 'skip': return props.theme.colors.onContainerWarning;
      default: return assertNever(props.$variant);
    }
  }};  

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--colorBg);
  color: var(--colorContent);
  border: 2px solid black;
  transition: ${(props) => `all ${props.theme.durationTransitionDefault}ms ease-out`};

  &:hover {
    filter: saturate(300%);
  }  
`;

export default FormButton;
