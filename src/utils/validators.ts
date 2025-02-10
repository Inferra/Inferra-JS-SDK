import { Message } from '../types';
import { AVAILABLE_MODELS } from '../constants';
import { InferraValidationError } from '../errors';

export function validateModel(model: string): void {
  if (!AVAILABLE_MODELS.hasOwnProperty(model)) {
    throw new InferraValidationError(
      `Model '${model}' is not supported. Available models: ${Object.keys(AVAILABLE_MODELS).join(', ')}`
    );
  }
}

export function validateMessages(messages: Message[]): void {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new InferraValidationError('Messages must be a non-empty array');
  }

  const validRoles = new Set(['system', 'user', 'assistant']);

  for (const [index, message] of messages.entries()) {
    if (!message.role || !validRoles.has(message.role)) {
      throw new InferraValidationError(
        `Invalid role '${message.role}' at index ${index}. Must be one of: ${Array.from(validRoles).join(', ')}`
      );
    }

    if (!message.content || typeof message.content !== 'string') {
      throw new InferraValidationError(
        `Invalid or missing content at index ${index}`
      );
    }
  }
}
