import type { Theme } from "../components/assets/themes/themeDefault.ts";


declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
