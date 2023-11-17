class EntityNotFoundError extends Error {
  constructor(
    readonly entityType: string,
    readonly entityIdentifier: string,
  ) {
    super(`Entity of type ${entityType} with identifier '${entityIdentifier}' wasn't found.`);
  }
}

export default EntityNotFoundError;
