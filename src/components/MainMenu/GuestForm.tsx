import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import TextInput from './TextInput';
import { Theme } from '../assets/themes/themeDefault';
import FormButton from './FormButton';

const Container = styled.form<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 0.75fr 0.75fr 1fr;
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
`;

const GuestForm = () => {
  const dispatch = useDispatch();

  return (
    <Container>
      <TextInput
        type="text"
        placeholder="Pick a username?"
        style={{ gridArea: 'username' }}
      />
      <Status>error</Status>
      <FormButton $variant="submit" style={{ gridArea: 'pick' }}>Pick</FormButton>
      <FormButton $variant="skip" style={{ gridArea: 'skip' }}>Skip</FormButton>
    </Container>
  );
};

export default GuestForm;
