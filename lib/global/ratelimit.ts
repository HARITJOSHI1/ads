import { Ratelimit } from "@upstash/ratelimit";
import { BlankInput } from "hono/types";
import { Context, Env } from "hono";
import { Redis } from "@upstash/redis";

const cache = new Map();

export default class RedisRateLimiter {
  static instance: Ratelimit;
  static getInstance(c: Context<Env, "", BlankInput>) {
    if (!this.instance) {
      const { REDIS_TOKEN, REDIS_URL } = process.env;
      const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        ephemeralCache: cache,
      });

      this.instance = ratelimit;
      return this.instance;
    }

    return this.instance;
  }
}
