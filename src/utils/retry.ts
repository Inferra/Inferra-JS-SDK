import { InferraAPIError, InferraRateLimitError } from '../errors';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  exponentialBase?: number;
  shouldRetry?: (error: Error) => boolean;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 60000,
    exponentialBase = 2,
    shouldRetry = (error: Error) => error instanceof InferraAPIError,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError;
      }

      if (error instanceof InferraRateLimitError && error.retryAfter) {
        delay = error.retryAfter * 1000;
      }

      await new Promise(resolve => setTimeout(resolve, Math.min(delay, maxDelay)));
      delay *= exponentialBase;
    }
  }

  throw lastError!;
}
