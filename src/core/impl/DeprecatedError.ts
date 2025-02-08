export class DeprecatedError extends Error {
  constructor(message: string = `Error: Function is deprecated and should not be used.`) {
    super(message);
    this.name = 'DeprecatedError';
  }
}
