import { InferraClient } from '../client';
import { ChatCompletionParams, Message } from '../types';
import { validateMessages, validateModel } from '../utils/validators';
import { ENDPOINTS } from '../constants';

export class ChatAPI {
  constructor(private client: InferraClient) {}

  /**
   * Create a chat completion
   */
  async create(params: ChatCompletionParams) {
    validateModel(params.model);
    validateMessages(params.messages);

    return this.client.post(ENDPOINTS.chat, {
      body: params,
      stream: params.stream,
    });
  }
}
