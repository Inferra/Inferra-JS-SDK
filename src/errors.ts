export class InferraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InferraError';
  }
}

export class InferraAPIError extends InferraError {
  statusCode?: number;
  response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'InferraAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class InferraAuthenticationError extends InferraAPIError {
  constructor(message: string = 'Invalid API key') {
    super(message, 401);
    this.name = 'InferraAuthenticationError';
  }
}

export class InferraRateLimitError extends InferraAPIError {
  retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message, 429);
    this.name = 'InferraRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class InferraValidationError extends InferraError {
  constructor(message: string) {
    super(message);
    this.name = 'InferraValidationError';
  }
}
