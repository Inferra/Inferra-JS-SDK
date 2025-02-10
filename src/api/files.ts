import { InferraClient } from '../client';
import { PaginationParams, BatchFile } from '../types';
import { ENDPOINTS } from '../constants';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

export class FilesAPI {
  constructor(private client: InferraClient) {}

  /**
   * Upload a file for batch processing
   */
  async create(
    file: string | Buffer | Readable,
    purpose: string = 'batch'
  ): Promise<BatchFile> {
    const form = new FormData();
    form.append('purpose', purpose);

    if (typeof file === 'string') {
      form.append('file', createReadStream(file));
    } else if (Buffer.isBuffer(file)) {
      form.append('file', file, { filename: 'batch.jsonl' });
    } else {
      form.append('file', file);
    }

    return this.client.post(ENDPOINTS.files, {
      body: form,
      headers: form.getHeaders(),
    });
  }

  /**
   * Retrieve file information
   */
  async retrieve(fileId: string): Promise<BatchFile> {
    return this.client.get(`${ENDPOINTS.files}/${fileId}`);
  }

  /**
   * List files
   */
  async list(params?: PaginationParams & { purpose?: string }): Promise<BatchFile[]> {
    return this.client.get(ENDPOINTS.files, { query: params });
  }

  /**
   * Delete a file
   */
  async delete(fileId: string): Promise<void> {
    await this.client.delete(`${ENDPOINTS.files}/${fileId}`);
  }

  /**
   * Download file content
   */
  async download(fileId: string): Promise<string> {
    const response = await this.client.get(`${ENDPOINTS.files}/${fileId}/content`);
    return response.toString();
  }
}
