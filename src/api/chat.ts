import { InferraClient } from '../client';
import { 
  ChatCompletion, 
  ChatCompletionChunk, 
  ChatCompletionParams, 
  Message 
} from '../types';
import { validateMessages, validateModel } from '../utils/validators';
import { ENDPOINTS } from '../constants';
import { RateLimiter } from '../utils/rate-limiter';
import { retryWithExponentialBackoff } from '../utils/retry';
import { InferraAPIError, InferraValidationError } from '../exceptions';

export class ChatAPI {
  private rateLimiter: RateLimiter;

  constructor(private client: InferraClient) {
    this.rateLimiter = new RateLimiter({
      requestsPerMinute: 500,
      burstSize: 50
    });
  }

  /**
   * Create a chat completion
   * @throws {InferraValidationError} If the input parameters are invalid
   * @throws {InferraAPIError} If the API request fails
   */
  @retryWithExponentialBackoff({ maxRetries: 3 })
  async create(params: ChatCompletionParams): Promise<ChatCompletion | AsyncIterator<ChatCompletionChunk>> {
    // Validate inputs
    validateModel(params.model);
    validateMessages(params.messages);

    if (params.temperature !== undefined && (params.temperature < 0 || params.temperature > 2)) {
      throw new InferraValidationError("Temperature must be between 0 and 2");
    }

    if (params.maxTokens !== undefined && params.maxTokens < 1) {
      throw new InferraValidationError("maxTokens must be positive");
    }

    await this.rateLimiter.acquire();

    try {
      const payload = this.buildPayload(params);
      
      const response = await this.client.post(ENDPOINTS.chat, {
        body: payload,
        stream: params.stream
      });

      if (params.stream) {
        return this.handleStreamingResponse(response);
      }
      
      return response as ChatCompletion;
    } catch (error) {
      if (error instanceof InferraAPIError) {
        throw error;
      }
      throw new InferraAPIError(`Chat completion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create multiple chat completions in parallel
   */
  async createMany(
    model: string,
    messageLists: Message[][],
    options: Omit<ChatCompletionParams, 'model' | 'messages'> = {}
  ): Promise<ChatCompletion[]> {
    const completions = messageLists.map(messages => 
      this.create({
        model,
        messages,
        ...options
      })
    );

    return Promise.all(completions) as Promise<ChatCompletion[]>;
  }

  private buildPayload(params: ChatCompletionParams): Record<string, any> {
    const payload: Record<string, any> = {
      model: params.model,
      messages: params.messages,
      stream: params.stream ?? false
    };

    // Add optional parameters if they're defined
    const optionalParams: (keyof ChatCompletionParams)[] = [
      'temperature',
      'maxTokens',
      'topP',
      'frequencyPenalty',
      'presencePenalty'
    ];

    for (const param of optionalParams) {
      if (params[param] !== undefined) {
        // Convert camelCase to snake_case for API compatibility
        const apiParam = param.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        payload[apiParam] = params[param];
      }
    }

    return payload;
  }

  private async *handleStreamingResponse(
    response: Response
  ): AsyncIterator<ChatCompletionChunk> {
    try {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          yield JSON.parse(line) as ChatCompletionChunk;
        }
      }
    } catch (error) {
      throw new InferraAPIError(`Error processing stream: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
