import { InferraClient } from '../../src';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import responses from '../__fixtures__/responses.json';

describe('BatchAPI', () => {
  let mock: MockAdapter;
  let client: InferraClient;

  beforeEach(() => {
    client = new InferraClient({ apiKey: 'test-key' });
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test('creates batch job', async () => {
    mock.onPost('/batch').reply(200, responses.batch);

    const response = await client.batch.create({
      input_file_id: 'file-abc',
      completion_window: '24h',
    });

    expect(response.id).toBe('batch_123');
    expect(response.status).toBe('completed');
  });

  test('retrieves batch status', async () => {
    mock.onGet('/batch/batch_123').reply(200, responses.batch);

    const response = await client.batch.retrieve('batch_123');

    expect(response.id).toBe('batch_123');
    expect(response.status).toBe('completed');
  });

  test('lists batch jobs', async () => {
    mock.onGet('/batch').reply(200, [responses.batch]);

    const response = await client.batch.list();

    expect(response).toHaveLength(1);
    expect(response[0].id).toBe('batch_123');
  });

  test('waits for batch completion', async () => {
    mock.onGet('/batch/batch_123')
      .replyOnce(200, { ...responses.batch, status: 'in_progress' })
      .onGet('/batch/batch_123')
      .replyOnce(200, responses.batch);

    const response = await client.batch.waitForCompletion('batch_123', {
      pollInterval: 100,
      timeout: 1000,
    });

    expect(response.status).toBe('completed');
  });
});
