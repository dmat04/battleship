import styled from 'styled-components';
import { Theme } from './assets/themes/themeDefault';

const MenuItemLabel = styled.p<{ theme: Theme }>`
  font-size: large;
  font-weight: bolder;
  text-align: center;
`;

export default MenuItemLabel;
