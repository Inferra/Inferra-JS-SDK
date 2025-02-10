export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface Choice {
  index: number;
  message: Message;
  finish_reason: string | null;
  logprobs: any | null;
}

export interface StreamChoice {
  index: number;
  delta: Partial<Message>;
  finish_reason: string | null;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ChatCompletionParams {
  model: string;
  messages: Message[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
}

export interface CompletionParams {
  model: string;
  prompt: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
}

export interface BatchRequestItem {
  custom_id: string;
  method: 'POST';
  url: string;
  body: ChatCompletionParams | CompletionParams;
}

export interface BatchCreateParams {
  input_file_id: string;
  completion_window: string;
  metadata?: Record<string, any>;
}

export interface BatchRequestCounts {
  total: number;
  completed: number;
  failed: number;
}

export interface BatchFile {
  id: string;
  object: 'file';
  purpose: string;
  filename: string;
  size: number;
  created_at: number;
  status: string;
}

export interface Batch {
  id: string;
  object: 'batch';
  status: BatchStatus;
  input_file_id: string;
  output_file_id: string | null;
  error_file_id: string | null;
  completion_window: string;
  created_at: number;
  in_progress_at: number | null;
  completed_at: number | null;
  failed_at: number | null;
  expired_at: number | null;
  request_counts: BatchRequestCounts;
  metadata?: Record<string, any>;
}

export type BatchStatus =
  | 'validating'
  | 'failed'
  | 'in_progress'
  | 'finalizing'
  | 'completed'
  | 'expired'
  | 'cancelling'
  | 'cancelled';
