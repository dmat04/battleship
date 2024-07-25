import { styled } from "styled-components";
import HeroBanner from "./HeroBanner.js";
import ThemeToggle from "./ThemeToggle.js";
import { Theme } from "../assets/themes/themeDefault.js";
import UserInfo from "./UserInfo.js";

const Container = styled.div<{ theme: Theme }>`
  grid-area: header;
  display: grid;
  grid-template-areas:
    "theme user"
    "hero hero";
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  background-color: ${(props) => props.theme.colors.surfaceTertiary};
  color: ${(props) => props.theme.colors.onSurfaceTertiary};
`;

const Header = () => (
  <Container>
    <ThemeToggle />
    <UserInfo />
    <HeroBanner />
  </Container>
);

export default Header;
