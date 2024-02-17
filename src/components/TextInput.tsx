import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';

const TextInput = styled.input<{ theme: Theme }>`
  padding: ${(props) => props.theme.paddingMin};

  &:focus {
    outline-offset: -2px;
  }
`;

export default TextInput;
