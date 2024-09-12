import { GuestUser, UserKind, RegisteredUser, GithubUser } from "../src/entities/UserDbModels.js";

export const GUEST_USERS: Omit<GuestUser, "id">[] = [
  {
    username: "UserA",
    kind: UserKind.GuestUser,
    expiresAt: new Date(),
  },
  {
    username: "SomeGuestUser",
    kind: UserKind.GuestUser,
    expiresAt: new Date(),
  },
];

export const REGISTERED_USERS: Omit<RegisteredUser, "id">[] = [
  {
    username: "UserB",
    kind: UserKind.RegisteredUser,
    passwordHash: "SomeVeryLongHash",
    email: "userb@domain.com",
    emailConfirmed: true,
  },
];

export const GITHUB_USERS: Omit<GithubUser, "id">[] = [
  {
    username: "UserC",
    kind: UserKind.GithubUser,
    githubId: "SomeGitHubId",
    refreshToken: "SomeGithubRefreshToken",
  },
];

export const ALL_USERS = [
  ...GUEST_USERS,
  ...REGISTERED_USERS,
  ...GITHUB_USERS,
]