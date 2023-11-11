class AuthenticationError extends Error {
  constructor(readonly cause: 'expired' | 'invalid') {
    super(`Access token error, token is ${cause}`);
  }
}

export default AuthenticationError;
