class EntityNotFoundError extends Error {
  constructor(entityType: string, entityIdentifier: string) {
    super(`Entity of type ${entityType} with identifier '${entityIdentifier}' wasn't found.`);
  }
}

export default EntityNotFoundError;
