import { styled } from "styled-components";
import { Theme } from "./assets/themes/themeDefault.js";

const TextInput = styled.input<{ theme: Theme }>`
  padding: ${(props) => props.theme.paddingMin};
  border: ${(props) => props.theme.borderStyle};
  border-color: ${(props) => props.theme.colors.containerSecondary};
  border-radius: 9999px;

  &:focus {
    outline-offset: -2px;
  }
`;

export default TextInput;
