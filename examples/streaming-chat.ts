import { InferraClient } from '../src';

async function main() {
  const client = new InferraClient({
    apiKey: process.env.INFERRA_API_KEY!,
  });

  const stream = await client.chat.create({
    model: 'meta-llama/llama-3.1-8b-instruct/fp-8',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Write a story about a space adventure.' },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
}

main().catch(console.error);
