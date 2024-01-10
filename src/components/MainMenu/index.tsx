import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/store";
import Button from "./Button";
import { Theme } from "../assets/themes/themeDefault";

const MenuContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.paddingMin};
`;

const Menu = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const handleGuestLogin = () => {

  };

  const handleLogin = () => {

  };

  const handleRegister = () => {

  };

  return (
    <MenuContainer>
      <Button label="Continue as guest" onClick={handleGuestLogin} />
      <Button label="Login" onClick={handleLogin} />
      <Button label="Register" onClick={handleRegister} />
    </MenuContainer>
  );
};

export default Menu;
