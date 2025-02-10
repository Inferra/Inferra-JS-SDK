import { InferraConfig } from './types';
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_MAX_RETRIES, DEFAULT_REQUESTS_PER_MINUTE } from './constants';

export function createConfig(config: Partial<InferraConfig> & { apiKey: string }): InferraConfig {
  if (!config.apiKey) {
    throw new Error('API key must be provided');
  }

  return {
    apiKey: config.apiKey,
    baseURL: config.baseURL || DEFAULT_BASE_URL,
    timeout: config.timeout || DEFAULT_TIMEOUT,
    maxRetries: config.maxRetries || DEFAULT_MAX_RETRIES,
    requestsPerMinute: config.requestsPerMinute || DEFAULT_REQUESTS_PER_MINUTE,
  };
}
