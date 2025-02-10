import { Message, Choice, Usage, StreamChoice } from '../types';

export class ChatCompletion {
  id: string;
  object: 'chat.completion';
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

export class ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
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
