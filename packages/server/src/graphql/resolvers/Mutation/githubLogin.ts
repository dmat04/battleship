import type { MutationResolvers } from "@battleship/common/types/__generated__/types.generated.js";
import GithubService from "../../../services/GithubService.js";
import AuthenticationError from "../../../services/errors/AuthenticationError.js";
import UserService from "../../../services/UserService.js";
import SessionService from "../../../services/SessionService.js";

export const githubLogin: NonNullable<
  MutationResolvers["githubLogin"]
> = async (_, _arg) => {
  const accessToken = await GithubService.requestAccessToken(_arg.accessCode);
  if (!accessToken) {
    throw new AuthenticationError("token invalid");
  }

  const userResponse = await GithubService.requestUser(
    accessToken?.access_token,
  );
  if (!userResponse) {
    throw new AuthenticationError("token invalid");
  }

  const githubUser = await UserService.createGithubUser(
    userResponse,
    accessToken.refresh_token,
  );

  return SessionService.loginUser(githubUser);
};
