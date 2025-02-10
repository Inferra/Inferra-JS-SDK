import { InferraClient } from '../client';
import { BatchCreateParams, PaginationParams, Batch } from '../types';
import { ENDPOINTS } from '../constants';

export class BatchAPI {
  constructor(private client: InferraClient) {}

  /**
   * Create a new batch processing job
   */
  async create(params: BatchCreateParams): Promise<Batch> {
    return this.client.post(ENDPOINTS.batch, { body: params });
  }

  /**
   * Retrieve a batch processing job
   */
  async retrieve(batchId: string): Promise<Batch> {
    return this.client.get(`${ENDPOINTS.batch}/${batchId}`);
  }

  /**
   * List batch processing jobs
   */
  async list(params?: PaginationParams): Promise<Batch[]> {
    return this.client.get(ENDPOINTS.batch, { query: params });
  }

  /**
   * Cancel a batch processing job
   */
  async cancel(batchId: string): Promise<Batch> {
    return this.client.post(`${ENDPOINTS.batch}/${batchId}/cancel`);
  }

  /**
   * Wait for a batch to complete
   */
  async waitForCompletion(
    batchId: string,
    options: { timeout?: number; pollInterval?: number } = {}
  ): Promise<Batch> {
    const { timeout = 86400000, pollInterval = 5000 } = options;
    const startTime = Date.now();

    while (true) {
      const batch = await this.retrieve(batchId);
      
      if (['completed', 'failed', 'cancelled', 'expired'].includes(batch.status)) {
        return batch;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Batch ${batchId} did not complete within timeout`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
}
