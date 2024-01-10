import styled from 'styled-components';
import { Theme } from '../assets/themes/themeDefault';

const ButtonContainer = styled.button<{ theme: Theme }>`
  background-color: white;
  border: 2px solid black;
  padding: ${(props) => props.theme.paddingMin};
  width: 20rem;

  &:hover {
    background-color: ${(props) => props.theme.colorBg};
  }
`;

interface Props {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const Button = ({ label, onClick }: Props) => (
  <ButtonContainer onClick={onClick}>
    {label}
  </ButtonContainer>
);

export default Button;
