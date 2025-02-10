import { InferraClient } from '../src';

async function main() {
  const client = new InferraClient({
    apiKey: process.env.INFERRA_API_KEY!,
  });

  const response = await client.chat.create({
    model: 'meta-llama/llama-3.1-8b-instruct/fp-8',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the meaning of life?' },
    ],
  });

  console.log('Response:', response.choices[0].message.content);
}

main().catch(console.error);
