import styled from 'styled-components';
import { ReactComponent as IconDark } from '../assets/icons/ic_dark_mode.svg';
import { ReactComponent as IconLight } from '../assets/icons/ic_light_mode.svg';
import { ReactComponent as IconDevice } from '../assets/icons/ic_devices.svg';
import { ThemePreference, useThemePreference } from '../ThemeProvider/ThemePreferenceContext';
import { Theme } from '../assets/themes/themeDefault';
import { assertNever } from '../../utils/typeUtils';

const Container = styled.div<{ theme: Theme }>`
  grid-area: theme;
  width: min-content;
  justify-self: start;
  align-self: flex-end;
  margin: ${(props) => props.theme.paddingMin};
`;

const IconContainer = styled.div<{ theme: Theme }>`
  border: ${(props) => props.theme.borderStyle};
  padding: 0.5rem;
  display: flex;
  background-color: ${(props) => props.theme.colors.containerSecondary};
  color: ${(props) => props.theme.colors.onContainerSecondary};
`;

const ThemeToggle = () => {
  const { userPreference, setUserPreference } = useThemePreference();

  let icon = null;
  switch (userPreference) {
    case 'system': icon = <IconDevice height={24} width={24} />; break;
    case 'light': icon = <IconLight height={24} width={24} />; break;
    case 'dark': icon = <IconDark height={24} width={24} />; break;
    default: assertNever(userPreference);
  }

  const onClick = () => {
    let newTheme: ThemePreference = 'system';
    switch (userPreference) {
      case 'system': newTheme = 'light'; break;
      case 'light': newTheme = 'dark'; break;
      case 'dark': newTheme = 'system'; break;
      default: assertNever(userPreference);
    }

    setUserPreference(newTheme);
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
