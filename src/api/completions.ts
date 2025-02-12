import { InferraClient } from '../client';
import { CompletionParams, Completion } from '../types';
import { validateModel } from '../utils/validators';
import { ENDPOINTS } from '../constants';
import { InferraValidationError, InferraAPIError } from '../errors';

export class CompletionsAPI {
  constructor(private client: InferraClient) {}

  /**
   * Create a text completion
   * 
   * @param params - The completion parameters
   * @returns A promise that resolves to a completion response
   * @throws {InferraValidationError} If the parameters are invalid
   * @throws {InferraAPIError} If the API request fails
   * 
   * @example
   * ```typescript
   * const completion = await client.completions.create({
   *   model: "meta-llama/llama-3.1-8b-instruct/fp-8",
   *   prompt: "Once upon a time",
   *   max_tokens: 100
   * });
   * ```
   */
  async create(params: CompletionParams): Promise<Completion> {
    // Validate required parameters
    if (!params.prompt || typeof params.prompt !== 'string') {
      throw new InferraValidationError('Prompt must be a non-empty string');
    }

    validateModel(params.model);

    // Validate optional parameters
    if (params.max_tokens !== undefined && (params.max_tokens < 1 || params.max_tokens > 4096)) {
      throw new InferraValidationError('max_tokens must be between 1 and 4096');
    }

    if (params.temperature !== undefined && (params.temperature < 0 || params.temperature > 2)) {
      throw new InferraValidationError('temperature must be between 0 and 2');
    }

    if (params.top_p !== undefined && (params.top_p < 0 || params.top_p > 1)) {
      throw new InferraValidationError('top_p must be between 0 and 1');
    }

    try {
      return await this.client.post(ENDPOINTS.completions, {
        body: params,
        stream: params.stream,
      });
    } catch (error) {
      if (error instanceof InferraAPIError) {
        throw error;
      }
      throw new InferraAPIError(
        `Failed to create completion: ${error.message}`,
        error.statusCode,
        error.response
      );
    }
  }

  /**
   * Create multiple completions in parallel
   * 
   * @param prompts - Array of prompts to generate completions for
   * @param params - Common parameters for all completions
   * @returns Array of completion responses
   */
  async createMany(
    prompts: string[],
    params: Omit<CompletionParams, 'prompt'>
  ): Promise<Completion[]> {
    return Promise.all(
      prompts.map(prompt =>
        this.create({
          ...params,
          prompt,
        })
      )
    );
  }
}
