import styled from 'styled-components';
import { ReactComponent as IconDark } from '../assets/icons/ic_dark_mode.svg';
import { ReactComponent as IconLight } from '../assets/icons/ic_light_mode.svg';
import useThemePreference from '../../hooks/useThemePreference';
import { Theme } from '../assets/themes/themeDefault';

const Container = styled.div<{ theme: Theme }>`
    grid-area: theme;
    width: min-content;
    justify-self: end;
    align-self: flex-end;
    margin: ${(props) => props.theme.paddingMin};
    color: ${(props) => props.theme.colors.onSurfaceTertiary};
`;

const ThemeToggle = () => {
  const { themePreference, setTheme } = useThemePreference();

  const icon = themePreference === 'light'
    ? <IconDark height={24} width={24} />
    : <IconLight height={24} width={24} />;

  const onClick = () => {
    const theme = themePreference === 'dark'
      ? 'light'
      : 'dark';

    setTheme(theme);
  };

  return (
    <Container onClick={onClick}>
      { icon }
    </Container>
  );
};

export default ThemeToggle;
