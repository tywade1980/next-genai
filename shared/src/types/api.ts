// API response types and utilities

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: import('./index').User;
  token: string;
  refreshToken: string;
}

export interface UpdateCheckRequest {
  platform: 'web' | 'android' | 'ios';
  currentVersion: string;
}

export interface UpdateCheckResponse {
  hasUpdate: boolean;
  latestVersion?: import('./index').AppVersion;
  isRequired?: boolean;
}