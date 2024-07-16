class AuthenticationError extends Error {
  constructor(readonly cause: 'token expired' | 'token invalid' | 'incorrect password') {
    super(`Authentication error: ${cause}`);
  }
}

export default AuthenticationError;
