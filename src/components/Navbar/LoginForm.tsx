import { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';

const FormContainer = styled.form<{ theme: Theme }>`
  display: flex;
  gap: ${(props) => props.theme.paddingMin};
`;

const Input = styled.input`
  
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
    login(username, password);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <SubmitButton type="submit">Login</SubmitButton>
    </FormContainer>
  );
};

export default LoginForm;
