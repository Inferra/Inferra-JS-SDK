export interface InferraConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  requestsPerMinute?: number;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  stream?: boolean;
  signal?: AbortSignal;
}

export interface PaginationParams {
  limit?: number;
  after?: string;
}
