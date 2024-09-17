import * as TRC from "typed-rest-client/RestClient.js";
import config from "../utils/config.js";

export interface GithubAccessToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly refresh_token_expires_in: number;
  readonly scope: string;
  readonly token_type: string;
}

export interface GithubUserResponse {
  readonly login: string;
  readonly id: string;
  readonly node_id: string;
  readonly avatar_url: string;
  readonly url: string;
  readonly html_url: string;
  readonly name: string;
  readonly email: string;
}

const oauthClient = new TRC.RestClient(
  "battleship-server",
  "https://github.com/login/oauth/",
);

const apiClient = new TRC.RestClient(
  "battleship-server",
  "https://api.github.com/",
  undefined,
  {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);

const requestAccessToken = async (
  code: string,
): Promise<GithubAccessToken | null> => {
  const url =
    `access_token?` +
    `client_id=${config.GITHUB_CLIENT_ID}` +
    `&client_secret=${config.GITHUB_CLIENT_SECRET}` +
    `&code=${code}`;

  const response = await oauthClient.get<GithubAccessToken>(url, {
    acceptHeader: "application/json",
  });

  return response.result;
};

const requestUser = async (
  accessToken: string,
): Promise<GithubUserResponse | null> => {
  const response = await apiClient.get<GithubUserResponse>("user", {
    acceptHeader: "application/json",
    additionalHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.result;
};

export default {
  requestAccessToken,
  requestUser,
};
