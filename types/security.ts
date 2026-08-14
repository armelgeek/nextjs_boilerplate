export enum AuditEventType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_PASSWORD_CHANGED = 'USER_PASSWORD_CHANGED',
  USER_PERMISSION_GRANTED = 'USER_PERMISSION_GRANTED',
  USER_PERMISSION_REVOKED = 'USER_PERMISSION_REVOKED',
  ROLE_CREATED = 'ROLE_CREATED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  ROLE_DELETED = 'ROLE_DELETED',
  PERMISSION_CREATED = 'PERMISSION_CREATED',
  PERMISSION_UPDATED = 'PERMISSION_UPDATED',
  PERMISSION_DELETED = 'PERMISSION_DELETED',
  CHECKOUT_SESSION_COMPLETED = 'CHECKOUT_SESSION_COMPLETED',
  CHECKOUT_SESSION_FAILED = 'CHECKOUT_SESSION_FAILED',
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
  SUBSCRIPTION_DELETED = 'SUBSCRIPTION_DELETED',
  PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_VALIDATION_FAILED = 'PAYMENT_VALIDATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  WEBHOOK_SIGNATURE_VALID = 'WEBHOOK_SIGNATURE_VALID',
  WEBHOOK_SIGNATURE_INVALID = 'WEBHOOK_SIGNATURE_INVALID',
  WEBHOOK_PROCESSING_ERROR = 'WEBHOOK_PROCESSING_ERROR',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  TWO_FACTOR_VERIFIED = 'TWO_FACTOR_VERIFIED',
}

export interface AuditLogEntry {
  id?: string;
  timestamp: Date;
  eventType: AuditEventType;
  status: 'success' | 'failure' | 'warning';
  message: string;
  userId?: string | null;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface WebhookEventGuard {
  shouldProcess: boolean;
  reason?: string;
  markProcessed: () => void;
}

export interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  webhook: {
    secret: string;
    timeout: number;
  };
}
