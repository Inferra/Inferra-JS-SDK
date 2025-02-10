import { InferraClient } from '../client';
import { CompletionParams } from '../types';
import { validateModel } from '../utils/validators';
import { ENDPOINTS } from '../constants';

export class CompletionsAPI {
  constructor(private client: InferraClient) {}

  /**
   * Create a text completion
   */
  async create(params: CompletionParams) {
    validateModel(params.model);

    return this.client.post(ENDPOINTS.completions, {
      body: params,
      stream: params.stream,
    });
  }
}
