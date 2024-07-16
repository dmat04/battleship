class GameplayError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}

export default GameplayError;
