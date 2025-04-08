import { UIElementProperties } from './interfaces';

export class IDError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'IDError';
  }
}

/* Custom Error to show the element blueprint that failed validation. */
export class InstantiationError extends Error {
  faultyBlueprint: Partial<UIElementProperties> | undefined;

  constructor(message: string, faultyBlueprint?: Partial<UIElementProperties>) {
    super(message);
    this.faultyBlueprint = faultyBlueprint;
  }
}
