import { styled } from "styled-components";
import TextInput from "../TextInput.js";
import { Theme } from "../assets/themes/themeDefault.js";
import { useAppDispatch, useAppSelector } from "../../store/store.js";
import { registeredLogin } from "../../store/authSlice.js";
import Button from "../Button.js";
import { useState } from "react";

const Container = styled.form<{ theme: Theme }>`
  width: 100%;
  display: grid;
  grid-template-rows: 0.75fr 0.75fr 0.75fr;
  grid-template-columns: 2fr 2fr 3fr;
  grid-row-gap: ${(props) => props.theme.paddingMin};
  grid-column-gap: ${(props) => props.theme.paddingMin};
  padding: ${(props) => props.theme.paddingMin} 0 0 0;
`;

interface Props {
  disabled: boolean;
}

const RegisteredLoginForm = ({ disabled }: Props) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useAppDispatch();
  const { loginRequestPending } = useAppSelector((state) => state.auth);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    void dispatch(registeredLogin({ username, password }));
  };

  return (
    <Container onSubmit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Username"
        style={{ gridArea: "1 / 1 / 1 / 4" }}
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        disabled={disabled}
      />
      <TextInput
        type="password"
        placeholder="Password"
        style={{ gridArea: "2 / 1 / 2 / 4" }}
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        disabled={disabled}
      />
      <Button
        type="submit"
        variant="primary"
        style={{ gridArea: "3 / 3 / 3 / 4" }}
        disabled={disabled || (username.length === 0 && password.length === 0)}
        loading={loginRequestPending}
      >
        <div>Log in</div>
      </Button>
    </Container>
  );
};

export default RegisteredLoginForm;
