import { Choice, Usage, StreamChoice } from '../types';

export class Completion {
  id: string;
  object: 'text_completion';
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;

  constructor(data: any) {
    this.id = data.id;
    this.object = data.object;
    this.created = data.created;
    this.model = data.model;
    this.choices = data.choices;
    this.usage = data.usage;
  }
}

export class CompletionChunk {
  id: string;
  object: 'text_completion.chunk';
  created: number;
  model: string;
  choices: StreamChoice[];

  constructor(data: any) {
    this.id = data.id;
    this.object = data.object;
    this.created = data.created;
    this.model = data.model;
    this.choices = data.choices;
  }
}
