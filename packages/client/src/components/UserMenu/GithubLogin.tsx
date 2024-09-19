import { useSearchParams } from "react-router-dom";
import { styled } from "styled-components";
import { useEffect } from "react";
import localStorageUtils from "../../utils/localStorageUtils.js";
import { useAppDispatch, useAppSelector } from "../../store/store.js";
import { useThemePreference } from "../ThemeProvider/ThemePreferenceContext.js";
import { githubLogin } from "../../store/authSlice.js";
import Button from "../Button.js";
import GithubIconDark from "../assets/icons/ic_github_dark.svg";
import GithubIconLight from "../assets/icons/ic_github_light.svg";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const Label = styled.div`
  align-content: center;
`;

const GithubLogin = () => {
  const dispatch = useAppDispatch();
  const [urlSearchParams] = useSearchParams();
  const from = urlSearchParams.get("from");
  const code = urlSearchParams.get("code");
  const state = urlSearchParams.get("state");

  useEffect(() => {
    if (from && code && state) {
      if (from === "github")
        void dispatch(githubLogin({ accessCode: code, state }));
    }
  }, [from, code, state]);
  const { githubLoginPending } = useAppSelector((state) => state.auth);
  const { theme } = useThemePreference();
  const iconComponent =
    theme === "light" ? (
      <GithubIconDark height={24} width={24} />
    ) : (
      <GithubIconLight height={24} width={24} />
    );

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
      <Container>
        {iconComponent}
        <Label>Login with GitHub</Label>
      </Container>
    </Button>
  );
};

export default GithubLogin;