import localStorageUtils from "../../utils/localStorageUtils.js";
import { useAppSelector } from "../../store/store.js";
import Button from "../Button.js";
import MenuItemLabel from "../MemuItemLabel.js";
import { useThemePreference } from "../ThemeProvider/ThemePreferenceContext.js";
import GithubIconDark from "../assets/icons/ic_github_dark.svg";
import GithubIconLight from "../assets/icons/ic_github_light.svg";

const GithubLogin = () => {
  const { githubLoginPending } = useAppSelector((state) => state.auth);
  const { theme } = useThemePreference();
  const iconComponent = theme === "light"
    ? <GithubIconDark height={24} width={24}/>
    : <GithubIconLight height={24} width={24}/>

  const githubRedirect = () => {
    const state = crypto.randomUUID();
    localStorageUtils.saveGithubOAuthState(state);

    const url =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${process.env.GITHUB_OAUTH_REDIRECT_URL}` +
      `&state=${state}`;

    window.location.href = url;
  };

  return (
    <Button
      variant="primary"
      onClick={githubRedirect}
      loading={githubLoginPending}
    >
      { iconComponent }
      <MenuItemLabel>Login with GitHub</MenuItemLabel>
    </Button>
  );
};

export default GithubLogin;
