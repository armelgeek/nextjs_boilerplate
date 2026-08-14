

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  check(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetAt) {
      
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      
      return false;
    }

    entry.count++;
    return true;
  }

  getRemaining(identifier: string, maxRequests: number): number {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() > entry.resetAt) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) {
      return 0;
    }
    return Math.max(0, entry.resetAt - Date.now());
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetAt) {
        this.requests.delete(key);
      }
    }
  }

  clear() {
    this.requests.clear();
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.requests.clear();
  }
}

export const rateLimiter = new RateLimiter();

export function createRateLimitMiddleware(
  maxRequests: number = 10,
  windowMs: number = 60 * 1000 
) {
  return (identifier: string) => {
    const allowed = rateLimiter.check(identifier, maxRequests, windowMs);
    return {
      allowed,
      remaining: rateLimiter.getRemaining(identifier, maxRequests),
      resetAt: rateLimiter.getResetTime(identifier),
    };
  };
}

export function getClientIdentifier(
  headers: Headers,
  fallback: string = "unknown"
): string {
  
  const forwarded = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const cfConnectingIp = headers.get("cf-connecting-ip");

  if (forwarded) {
    
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return fallback;
}

export interface RateLimitConfig {
  
  limit: number;
  
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `rl:${identifier}`;

  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt: entry.resetAt,
    };
  }

  if (existing.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count++;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export const authRateLimit = (ip: string) =>
  rateLimit(`auth:${ip}`, { limit: 10, windowSeconds: 60 });

export const passwordResetRateLimit = (ip: string) =>
  rateLimit(`pwd-reset:${ip}`, { limit: 3, windowSeconds: 300 });

export const signupRateLimit = (ip: string) =>
  rateLimit(`signup:${ip}`, { limit: 5, windowSeconds: 60 });
