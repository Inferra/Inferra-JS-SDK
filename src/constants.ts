export const DEFAULT_BASE_URL = 'https://api.inferra.net/v1';

export const AVAILABLE_MODELS = {
  'meta-llama/llama-3.2-1b-instruct/fp-8': 0.015,
  'meta-llama/llama-3.2-3b-instruct/fp-8': 0.03,
  'meta-llama/llama-3.1-8b-instruct/fp-8': 0.045,
  'meta-llama/llama-3.1-8b-instruct/fp-16': 0.05,
  'mistralai/mistral-nemo-12b-instruct/fp-8': 0.10,
  'meta-llama/llama-3.1-70b-instruct/fp-8': 0.30,
} as const;

export const ENDPOINTS = {
  chat: '/chat/completions',
  completions: '/completions',
  batch: '/batch',
  files: '/files',
} as const;

export const RATE_LIMITS = {
  language_models: 500, // requests per minute
  image_models: 100, // requests per minute
} as const;

export const BATCH_LIMITS = {
  max_requests: 50000,
  max_file_size: 200 * 1024 * 1024, // 200 MB
} as const;

export const DEFAULT_TIMEOUT = 60000; // 60 seconds
export const DEFAULT_MAX_RETRIES = 3;
export const DEFAULT_REQUESTS_PER_MINUTE = 500;

export const BATCH_STATUS = {
  VALIDATING: 'validating',
  FAILED: 'failed',
  IN_PROGRESS: 'in_progress',
  FINALIZING: 'finalizing',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  CANCELLING: 'cancelling',
  CANCELLED: 'cancelled',
} as const;
