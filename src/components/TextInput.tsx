import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';

const TextInput = styled.input<{ theme: Theme }>`
  padding: ${(props) => props.theme.paddingMin};
  border: 2px solid ${(props) => props.theme.colors.surfacePrimary};
  border-radius: 9999px;

  &:focus {
    outline-offset: -2px;
  }
`;

export default TextInput;
