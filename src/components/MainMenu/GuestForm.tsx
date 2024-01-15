import styled from 'styled-components';
import TextInput from './TextInput';
import { Theme } from '../assets/themes/themeDefault';
import FormButton from './FormButton';
import useUsernameChecker from '../../hooks/useUsernameChecker';

const Container = styled.form<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 0.75fr 0.5fr 1fr;
  grid-template-areas: 
    "username username"
    "status status"
    "pick skip";
  grid-row-gap: ${(props) => props.theme.paddingMin};
  grid-column-gap: ${(props) => props.theme.paddingMin};
  padding: ${(props) => props.theme.paddingMin} 0 0 0;
`;

const Status = styled.p`
  grid-area: status;
  font-size: smaller;
`;

interface Props {
  disabled: boolean;
}

const GuestForm = ({ disabled }: Props) => {
  const {
    username,
    setUsername,
    checkIsPending,
    errorMessage,
  } = useUsernameChecker(
    'Pick a username or skip and have one picked for you',
    'Good to go!',
    'Username is taken',
  );

  return (
    <Container>
      <TextInput
        type="text"
        placeholder="Pick a username?"
        style={{ gridArea: 'username' }}
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        disabled={disabled}
      />
      <Status>{errorMessage}</Status>
      <FormButton
        $variant="submit"
        style={{ gridArea: 'pick' }}
        disabled={disabled}
      >
        Pick
      </FormButton>
      <FormButton
        $variant="skip"
        style={{ gridArea: 'skip' }}
        disabled={disabled}
      >
        Skip
      </FormButton>
    </Container>
  );
};

export default GuestForm;
