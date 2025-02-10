# Inferra JavaScript SDK

The official JavaScript SDK for Inferra.net - Access leading open source AI models with just a few lines of code.

## Installation

```bash
npm install @inferra/sdk
# or
yarn add @inferra/sdk
```

## Quick Start

```typescript
import { InferraClient } from '@inferra/sdk';

const client = new InferraClient({
  apiKey: 'your-api-key'
});

// Create a chat completion
const response = await client.chat.create({
  model: 'meta-llama/llama-3.1-8b-instruct/fp-8',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the meaning of life?' }
  ],
  stream: true
});

// Process streaming response
for await (const chunk of response) {
  if (chunk.choices[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}
```

## Features
- Full support for Inferra's API
- Written in TypeScript with complete type definitions
- Built-in rate limiting and retries
- Streaming support
- Batch processing
- Comprehensive documentation

## Available Models
| Model Name | Price (per 1M tokens) |
|------------|----------------------|
| meta-llama/llama-3.2-1b-instruct/fp-8 | $0.015 |
| meta-llama/llama-3.2-3b-instruct/fp-8 | $0.03 |
| meta-llama/llama-3.1-8b-instruct/fp-8 | $0.045 |
| meta-llama/llama-3.1-8b-instruct/fp-16 | $0.05 |
| mistralai/mistral-nemo-12b-instruct/fp-8 | $0.10 |
| meta-llama/llama-3.1-70b-instruct/fp-8 | $0.30 |

## Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build
npm run build
```
