import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { InferraConfig, RequestOptions } from './types';
import { createConfig } from './config';
import { ChatAPI } from './api/chat';
import { CompletionsAPI } from './api/completions';
import { BatchAPI } from './api/batch';
import { FilesAPI } from './api/files';
import { InferraAPIError, InferraAuthenticationError, InferraRateLimitError } from './errors';
import { RateLimiter } from './utils/rateLimiter';

export class InferraClient {
  private config: InferraConfig;
  private axios: AxiosInstance;
  private rateLimiter: RateLimiter;

  public chat: ChatAPI;
  public completions: CompletionsAPI;
  public batch: BatchAPI;
  public files: FilesAPI;

  constructor(config: Partial<InferraConfig> & { apiKey: string }) {
    this.config = createConfig(config);
    this.rateLimiter = new RateLimiter(this.config.requestsPerMinute);

    // Initialize axios instance
    this.axios = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Initialize API interfaces
    this.chat = new ChatAPI(this);
    this.completions = new CompletionsAPI(this);
    this.batch = new BatchAPI(this);
    this.files = new FilesAPI(this);

    // Add request interceptor for rate limiting
    this.axios.interceptors.request.use(async config => {
      await this.rateLimiter.acquire();
      return config;
    });

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 401) {
            throw new InferraAuthenticationError();
          }

          if (status === 429) {
            const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10);
            throw new InferraRateLimitError('Rate limit exceeded', retryAfter);
          }

          throw new InferraAPIError(
            data.error?.message || 'API request failed',
            status,
            data
          );
        }

        throw new InferraAPIError(error.message);
      }
    );
  }

  /**
   * Make a request to the API.
   */
  async request<T>({
    method,
    path,
    query,
    body,
    headers,
    stream = false,
    signal,
  }: RequestOptions): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url: path,
      params: query,
      data: body,
      headers,
      signal,
      responseType: stream ? 'stream' : 'json',
    };

    const response = await this.axios.request<T>(config);
    return response.data;
  }

  /**
   * Convenience method for GET requests.
   */
  async get<T>(path: string, options: Omit<RequestOptions, 'method' | 'path'> = {}): Promise<T> {
    return this.request<T>({ method: 'GET', path, ...options });
  }

  /**
   * Convenience method for POST requests.
   */
  async post<T>(path: string, options: Omit<RequestOptions, 'method' | 'path'> = {}): Promise<T> {
    return this.request<T>({ method: 'POST', path, ...options });
  }

  /**
   * Convenience method for DELETE requests.
   */
  async delete<T>(path: string, options: Omit<RequestOptions, 'method' | 'path'> = {}): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, ...options });
  }
}
