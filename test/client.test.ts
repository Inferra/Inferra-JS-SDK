import { InferraClient } from '../src';
import { InferraAuthenticationError, InferraRateLimitError } from '../src/errors';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('InferraClient', () => {
  let mock: MockAdapter;
  let client: InferraClient;

  beforeEach(() => {
    client = new InferraClient({ apiKey: 'test-key' });
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test('initializes with provided API key', () => {
    expect(client).toBeInstanceOf(InferraClient);
  });

  test('throws error when API key is missing', () => {
    expect(() => new InferraClient({ apiKey: '' })).toThrow();
  });

  test('handles authentication errors', async () => {
    mock.onAny().reply(401);

    await expect(client.get('/test')).rejects.toThrow(InferraAuthenticationError);
  });

  test('handles rate limit errors', async () => {
    mock.onAny().reply(429, {}, { 'retry-after': '30' });

    await expect(client.get('/test')).rejects.toThrow(InferraRateLimitError);
  });
});
