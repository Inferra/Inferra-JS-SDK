import { Readable } from 'stream';
import { InferraAPIError } from '../errors';

export class StreamProcessor {
  static async *processStream(stream: Readable): AsyncGenerator<any, void, unknown> {
    let buffer = '';

    for await (const chunk of stream) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      
      // Keep the last line in buffer if it's incomplete
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            yield JSON.parse(data);
          } catch (error) {
            throw new InferraAPIError(`Error parsing stream data: ${error.message}`);
          }
        }
      }
    }

    if (buffer.trim() !== '') {
      try {
        const data = buffer.startsWith('data: ') ? buffer.slice(6) : buffer;
        if (data !== '[DONE]') {
          yield JSON.parse(data);
        }
      } catch (error) {
        throw new InferraAPIError(`Error parsing final stream data: ${error.message}`);
      }
    }
  }
}
