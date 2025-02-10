import { InferraRateLimitError } from '../errors';

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly refillRate: number;
  private readonly bucketSize: number;

  constructor(
    requestsPerMinute: number,
    bucketSize: number = requestsPerMinute
  ) {
    this.refillRate = requestsPerMinute / 60; // tokens per second
    this.bucketSize = bucketSize;
    this.tokens = bucketSize;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000; // convert to seconds
    const newTokens = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.bucketSize, this.tokens + newTokens);
    this.lastRefill = now;
  }

  async acquire(tokens: number = 1): Promise<void> {
    this.refill();

    if (this.tokens < tokens) {
      const timeToWait = ((tokens - this.tokens) / this.refillRate) * 1000;
      throw new InferraRateLimitError(
        `Rate limit exceeded. Try again in ${Math.ceil(timeToWait / 1000)} seconds.`,
        Math.ceil(timeToWait / 1000)
      );
    }

    this.tokens -= tokens;
  }
}
