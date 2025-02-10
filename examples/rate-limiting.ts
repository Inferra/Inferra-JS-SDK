import { InferraClient, InferraRateLimitError } from '../src';

async function main() {
  const client = new InferraClient({
    apiKey: process.env.INFERRA_API_KEY!,
    requestsPerMinute: 10, // Set low limit for demonstration
  });

  const messages = Array(20).fill(null).map((_, i) => ({
    model: 'meta-llama/llama-3.1-8b-instruct/fp-8',
    messages: [{ role: 'user', content: `Quick question ${i + 1}` }],
  }));

  const results = await Promise.allSettled(
    messages.map(params => client.chat.create(params))
  );

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`Request ${i + 1}: Success`);
    } else {
      if (result.reason instanceof InferraRateLimitError) {
        console.log(`Request ${i + 1}: Rate limited - ${result.reason.message}`);
      } else {
        console.log(`Request ${i + 1}: Failed - ${result.reason.message}`);
      }
    }
  });
}

main().catch(console.error);
