export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, any>;
}

export type ActionResult<T = any> =
  | { success: true; data: T }
  | { success: false; error: string };
