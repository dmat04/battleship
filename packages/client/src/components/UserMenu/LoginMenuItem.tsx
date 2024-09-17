import { styled } from "styled-components";
import GithubLogin from "./GithubLogin.js";
import RegisteredLoginForm from "./RegisteredLoginForm.js";
import { Theme } from "../assets/themes/themeDefault.js";

interface Props {
  disabled: boolean;
}

const Container = styled.div<{ theme: Theme }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: ${(props) => props.theme.paddingMin};
`;

const Divider = styled.hr<{ theme: Theme }>`
  border: 0;
  height: ${(props) => props.theme.dimensionBorder};
  width: 100%;
  background: ${(props) => props.theme.colors.onContainerPrimary};
`;

const LoginMenuItem = ({ disabled }: Props) => {
  return (
    <Container>
      <RegisteredLoginForm disabled={disabled} />
      <Divider />
      <GithubLogin />
    </Container>
  );
};

export default LoginMenuItem;
