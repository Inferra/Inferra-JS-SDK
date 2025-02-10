import { BatchStatus, BatchRequestCounts } from '../types';

export class BatchFile {
  id: string;
  object: 'file';
  purpose: string;
  filename: string;
  size: number;
  created_at: number;
  status: string;

  constructor(data: any) {
    this.id = data.id;
    this.object = data.object;
    this.purpose = data.purpose;
    this.filename = data.filename;
    this.size = data.size;
    this.created_at = data.created_at;
    this.status = data.status;
  }
}

export class Batch {
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

  constructor(data: any) {
    this.id = data.id;
    this.object = data.object;
    this.status = data.status;
    this.input_file_id = data.input_file_id;
    this.output_file_id = data.output_file_id;
    this.error_file_id = data.error_file_id;
    this.completion_window = data.completion_window;
    this.created_at = data.created_at;
    this.in_progress_at = data.in_progress_at;
    this.completed_at = data.completed_at;
    this.failed_at = data.failed_at;
    this.expired_at = data.expired_at;
    this.request_counts = data.request_counts;
    this.metadata = data.metadata;
  }
}
