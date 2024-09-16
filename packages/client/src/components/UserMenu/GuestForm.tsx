import { styled } from "styled-components";
import TextInput from "../TextInput.js";
import { Theme } from "../assets/themes/themeDefault.js";
import useUsernameChecker from "../../hooks/useUsernameChecker.js";
import { useAppDispatch, useAppSelector } from "../../store/store.js";
import { guestLogin } from "../../store/authSlice.js";
import Spinner from "../Spinner/Spinner.js";
import Button from "../Button.js";
import { UserKind } from "@battleship/common/types/__generated__/types.generated.js";

const Container = styled.form<{ theme: Theme }>`
  width: 100%;
  display: grid;
  grid-template-rows: 0.75fr 0.75fr 1fr;
  grid-template-areas:
    "username"
    "status"
    "button";
  grid-row-gap: ${(props) => props.theme.paddingMin};
  grid-column-gap: ${(props) => props.theme.paddingMin};
  padding: ${(props) => props.theme.paddingMin} 0 0 0;
`;

const Status = styled.div`
  grid-area: status;
  font-size: smaller;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

interface Props {
  disabled: boolean;
}

const GuestForm = ({ disabled }: Props) => {
  const { username, setUsername, checkIsPending, message, isValid } =
    useUsernameChecker(
      "Pick a username or continue and have one picked for you",
      "Good to go!",
      "Username is taken",
      UserKind.GuestUser,
    );

  const dispatch = useAppDispatch();
  const { loginRequestPending } = useAppSelector((state) => state.auth);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    if (username.length === 0) {
      void dispatch(guestLogin(null));
    } else if (isValid) {
      void dispatch(guestLogin(username));
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Pick a username?"
        style={{ gridArea: "username" }}
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        disabled={disabled}
      />
      <Status>
        <p>{message}</p>
        <Spinner visible={checkIsPending} />
      </Status>
      <Button
        type="submit"
        variant="primary"
        style={{ gridArea: "button" }}
        disabled={disabled}
        loading={loginRequestPending}
      >
        {/* {
          loginRequestPending || loading
            ? <Spinner visible={loading} />
            : <div>Continue</div>
        } */}
        {/* <Spinner visible={loading} /> */}
        <div>Continue</div>
      </Button>
    </Container>
  );
};

export default GuestForm;
