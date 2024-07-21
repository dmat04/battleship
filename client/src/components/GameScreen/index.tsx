import { Outlet } from "react-router-dom";
import styled from "styled-components";
import StatusHeader from "./StatusHeader";
import { Theme } from "../assets/themes/themeDefault";

const Container = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.paddingMin};
  width: min-content;
`;

const GameScreen = () => (
  <Container>
    <StatusHeader />
    <Outlet />
  </Container>
);

export default GameScreen;
