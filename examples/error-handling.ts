import { InferraClient, InferraAPIError, InferraRateLimitError, InferraAuthenticationError } from '../src';

async function main() {
  const client = new InferraClient({
    apiKey: process.env.INFERRA_API_KEY!,
  });

  try {
    // Try with invalid model
    await client.chat.create({
      model: 'nonexistent-model',
      messages: [{ role: 'user', content: 'Hello!' }],
    });
  } catch (error) {
    if (error instanceof InferraAuthenticationError) {
      console.error('Authentication failed:', error.message);
    } else if (error instanceof InferraRateLimitError) {
      console.error('Rate limit exceeded:', error.message);
      console.error('Retry after:', error.retryAfter, 'seconds');
    } else if (error instanceof InferraAPIError) {
      console.error('API Error:', error.message);
      console.error('Status code:', error.statusCode);
      console.error('Response:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main().catch(console.error);
