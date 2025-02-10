import { InferraClient } from '../../src';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createReadStream } from 'fs';
import { join } from 'path';

describe('FilesAPI', () => {
  let mock: MockAdapter;
  let client: InferraClient;

  beforeEach(() => {
    client = new InferraClient({ apiKey: 'test-key' });
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  test('uploads file', async () => {
    mock.onPost('/files').reply(200, {
      id: 'file-123',
      object: 'file',
      purpose: 'batch',
      filename: 'test.jsonl',
      status: 'processed',
    });

    const filePath = join(__dirname, '../__fixtures__/batch-files/input.jsonl');
    const response = await client.files.create(createReadStream(filePath));

    expect(response.id).toBe('file-123');
    expect(response.purpose).toBe('batch');
  });

  test('downloads file content', async () => {
    const content = 'file content';
    mock.onGet('/files/file-123/content').reply(200, content);

    const response = await client.files.download('file-123');

    expect(response).toBe(content);
  });

  test('deletes file', async () => {
    mock.onDelete('/files/file-123').reply(204);

    await expect(client.files.delete('file-123')).resolves.not.toThrow();
  });
});
