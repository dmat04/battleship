import {
  GuestUser,
  RegisteredUser,
  GithubUser,
} from "../src/entities/UserDbModels.js";
import { addDays } from "date-fns";
import { UserKind } from "../src/types/__generated__/types.generated.js";

export const GUEST_USERS: Omit<GuestUser, "id">[] = [
  {
    username: "UserA",
    kind: UserKind.GuestUser,
    expiresAt: addDays<Date>(new Date(), 1),
  },
  {
    username: "SomeGuestUser",
    kind: UserKind.GuestUser,
    expiresAt: addDays<Date>(new Date(), 1),
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
    githubId: "userC_githubID",
    refreshToken: "userC_github_refreshToken",
  },
  {
    username: "UserD",
    kind: UserKind.GithubUser,
    githubId: "userD_githubID",
    refreshToken: "userD_github_refreshToken",
  },
];

export const ALL_USERS = [...GUEST_USERS, ...REGISTERED_USERS, ...GITHUB_USERS];
