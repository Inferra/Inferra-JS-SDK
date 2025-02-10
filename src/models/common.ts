export class Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;

  constructor(data: any) {
    this.prompt_tokens = data.prompt_tokens;
    this.completion_tokens = data.completion_tokens;
    this.total_tokens = data.total_tokens;
  }
}

export class Choice {
  index: number;
  message: {
    role: string;
    content: string;
    name?: string;
  };
  finish_reason: string | null;

  constructor(data: any) {
    this.index = data.index;
    this.message = data.message;
    this.finish_reason = data.finish_reason;
  }
}
