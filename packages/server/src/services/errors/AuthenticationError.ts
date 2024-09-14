class AuthenticationError extends Error {
  constructor(
    readonly cause: "token expired" | "token invalid" | "incorrect password" | "user expired",
  ) {
    super(`Authentication error: ${cause}`);
  }
}

export default AuthenticationError;
