import styled from 'styled-components';
import TextInput from '../TextInput';
import { Theme } from '../assets/themes/themeDefault';
import FormButton from '../FormButton';
import useUsernameChecker from '../../hooks/useUsernameChecker';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { guestLogin } from '../../store/authSlice';
import SpinnerAnim from '../assets/icons/180-ring.svg';

const Container = styled.form<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 0.75fr 0.75fr 1fr;
  grid-template-areas: 
    "username"
    "status"
    "button";
  grid-row-gap: ${(props) => props.theme.paddingMin};
  grid-column-gap: ${(props) => props.theme.paddingMin};
  /* align-items: stretch; */
  padding: ${(props) => props.theme.paddingMin} 0 0 0;
`;

const Status = styled.div`
  grid-area: status;
  font-size: smaller;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Spinner = styled.div<{ $visible: boolean }>`
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  background: url(${SpinnerAnim});
  background-position: center;
  background-repeat: no-repeat;
  width: 2rem;
  aspect-ratio: 1;
`;

interface Props {
  disabled: boolean;
}

const GuestForm = ({ disabled }: Props) => {
  const {
    username,
    setUsername,
    checkIsPending,
    message,
    isValid,
  } = useUsernameChecker(
    'Pick a username or continue and have one picked for you',
    'Good to go!',
    'Username is taken',
  );

  const dispatch = useAppDispatch();
  const { loginRequestPending } = useAppSelector((state) => state.auth);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    if (username.length === 0) {
      dispatch(guestLogin(null));
    } else if (isValid) {
      dispatch(guestLogin(username));
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Pick a username?"
        style={{ gridArea: 'username' }}
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        disabled={disabled}
      />
      <Status>
        <p>{message}</p>
        <Spinner $visible={checkIsPending} />
      </Status>
      <FormButton
        type="submit"
        $variant="skip"
        style={{ gridArea: 'button' }}
        disabled={disabled}
      >
        {
          loginRequestPending
            ? <Spinner $visible />
            : <div>Continue</div>
        }
      </FormButton>
    </Container>
  );
};

export default GuestForm;
