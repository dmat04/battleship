import styled from 'styled-components';
import { ReactComponent as IconDark } from '../assets/icons/ic_dark_mode.svg';
import { ReactComponent as IconLight } from '../assets/icons/ic_light_mode.svg';
import useThemePreference from '../../hooks/useThemePreference';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
  grid-area: theme;
  width: min-content;
  justify-self: start;
  align-self: flex-end;
  margin: ${(props) => props.theme.paddingMin};
`;

const IconContainer = styled.div<{ theme: Theme }>`
  border-width: ${(props) => props.theme.dimensionBorder};
  border-color: ${(props) => props.theme.colors.onContainerSecondary};
  border-style: solid;
  padding: 0.5rem;
  display: flex;
  background-color: ${(props) => props.theme.colors.containerSecondary};
  color: ${(props) => props.theme.colors.onContainerSecondary};
`;

const ThemeToggle = () => {
  const { themePreference, setTheme } = useThemePreference();

  const icon = themePreference === 'light'
    ? <IconDark height={24} width={24} />
    : <IconLight height={24} width={24} />;

  const onClick = () => {
    const newTheme = themePreference === 'dark'
      ? 'light'
      : 'dark';

    setTheme(newTheme);
  };

  return (
    <Container onClick={onClick}>
      <IconContainer>
        {icon}
      </IconContainer>
    </Container>
  );
};

export default ThemeToggle;
