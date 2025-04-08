export class AspectError extends Error {
  code: string;
  name = 'AspectError';
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
