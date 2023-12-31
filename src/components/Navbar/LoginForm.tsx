import { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';

const FormContainer = styled.form<{ theme: Theme }>`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.paddingMin};

  @media (max-width: 35em) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  width: 100%;
`;

const SubmitButton = styled.button`

`;

export interface PropTypes {
  login: (username: string, password: string) => Promise<void>;
}

const LoginForm = ({ login }: PropTypes) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (username.length > 0 && password.length > 0) {
      login(username, password);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value.trim())}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value.trim())}
      />
      <SubmitButton type="submit">Login</SubmitButton>
    </FormContainer>
  );
};

export default LoginForm;
