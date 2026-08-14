export interface AuthProvider {
  id: string;
  name: string;
  enabled: boolean;
  clientId?: string;
}

export interface TwoFactorSecret {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  userId: string;
  secret: string;
  verifiedAt?: Date;
  backupCodesUsed: string[];
}

export interface ResetPasswordToken {
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface EmailVerificationToken {
  token: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface LoginAttempt {
  email: string;
  success: boolean;
  ipAddress: string;
  timestamp: Date;
}

export interface AuthSession {
  sessionId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthError {
  code: string;
  message: string;
  statusCode: number;
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TWO_FACTOR_REQUIRED = 'TWO_FACTOR_REQUIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
}
