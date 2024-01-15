import styled from 'styled-components';
import { useState } from 'react';
import TextInput from '../TextInput';
import { Theme } from '../assets/themes/themeDefault';
import FormButton from '../FormButton';
import { useAppDispatch } from '../../store/store';
import { guestLogin } from '../../store/authSlice';
import SpinnerAnim from '../assets/icons/180-ring.svg';

const Container = styled.form<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 0.75fr 0.75fr 1fr;
  grid-template-areas: 
    "code"
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

const JoinGameForm = ({ disabled }: Props) => {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string>('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    if (code.length > 0) {
      dispatch(guestLogin(null));
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Room code"
        style={{ gridArea: 'code' }}
        value={code}
        onChange={(ev) => setCode(ev.target.value)}
        disabled={disabled}
      />
      <Status>
        <p>Join using a code</p>
      </Status>
      <FormButton
        type="submit"
        $variant="submit"
        style={{ gridArea: 'button' }}
        disabled={disabled}
      >
        {
          (true)
            ? <Spinner $visible />
            : <div>Continue</div>
        }
      </FormButton>
    </Container>
  );
};

export default JoinGameForm;
