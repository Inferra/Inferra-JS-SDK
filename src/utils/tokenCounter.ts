import { Message } from '../types';

// Note: This is a simplified implementation.
export class TokenCounter {
  private readonly model: string;

  constructor(model: string) {
    this.model = model;
  }

  countMessageTokens(messages: Message[]): number {
    let tokens = 0;

    for (const message of messages) {
      // Per-message overhead
      tokens += 4; // Every message follows <im_start>{role/name}\n{content}<im_end>\n

      // Count tokens in the content
      tokens += this.countString(message.content);

      // Add tokens for the role
      tokens += this.countString(message.role);

      if (message.name) {
        tokens += this.countString(message.name);
        tokens += 1; // Additional overhead for name
      }
    }

    return tokens;
  }

  private countString(text: string): number {
    // This is a very rough approximation
    return Math.ceil(text.length / 4);
  }
}
