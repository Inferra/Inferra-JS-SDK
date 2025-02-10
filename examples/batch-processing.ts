import { InferraClient } from '../src';
import { createReadStream } from 'fs';
import { join } from 'path';

async function main() {
  const client = new InferraClient({
    apiKey: process.env.INFERRA_API_KEY!,
  });

  // Upload batch input file
  const batchFile = await client.files.create(
    createReadStream(join(__dirname, 'batch-input.jsonl')),
    'batch'
  );

  console.log('Uploaded batch file:', batchFile.id);

  // Create batch processing job
  const batch = await client.batch.create({
    input_file_id: batchFile.id,
    completion_window: '24h',
    metadata: {
      description: 'Example batch job',
    },
  });

  console.log('Created batch:', batch.id);

  // Wait for completion
  console.log('Waiting for batch completion...');
  const completedBatch = await client.batch.waitForCompletion(batch.id, {
    pollInterval: 5000,
  });

  // Download results
  if (completedBatch.output_file_id) {
    const results = await client.files.download(completedBatch.output_file_id);
    console.log('Results:', results);
  }

  if (completedBatch.error_file_id) {
    const errors = await client.files.download(completedBatch.error_file_id);
    console.log('Errors:', errors);
  }
}

main().catch(console.error);
