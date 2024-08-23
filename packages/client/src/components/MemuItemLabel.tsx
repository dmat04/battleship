import { styled } from "styled-components";
import { Theme } from "./assets/themes/themeDefault.js";

const MenuItemLabel = styled.p<{ theme: Theme }>`
  font-size: large;
  font-weight: bolder;
  text-align: center;
  cursor: default;
`;

export default MenuItemLabel;
