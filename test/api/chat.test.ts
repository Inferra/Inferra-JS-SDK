import { InferraClient } from '../../src';
import { InferraValidationError } from '../../src/errors';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import responses from '../__fixtures__/responses.json';

describe('ChatAPI', () => {
  let mock: MockAdapter;
  let client: InferraClient;

  beforeEach(() => {
    client = new InferraClient({ apiKey: 'test-key' });
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test('creates chat completion', async () => {
    mock.onPost('/chat/completions').reply(200, responses.chat_completion);

    const response = await client.chat.create({
      model: 'meta-llama/llama-3.1-8b-instruct/fp-8',
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(response.choices[0].message.content).toBeDefined();
  });

  test('validates model name', async () => {
    await expect(client.chat.create({
      model: 'invalid-model',
      messages: [{ role: 'user', content: 'Hello' }],
    })).rejects.toThrow(InferraValidationError);
  });

  test('validates messages', async () => {
    await expect(client.chat.create({
      model: 'meta-llama/llama-3.1-8b-instruct/fp-8',
      messages: [],
    })).rejects.toThrow(InferraValidationError);
  });
});
