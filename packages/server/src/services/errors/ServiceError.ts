class ServiceError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}

export default ServiceError;
