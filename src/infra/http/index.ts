import { env } from '@/infra/utils/env';

import { HttpClient } from './client';
import { authRequestInterceptor } from './interceptors/auth';
import { errorResponseInterceptor } from './interceptors/error';

// ใช้กับ public endpoints (login, refresh token) — ไม่มี auth header
export const authClient = new HttpClient({
  baseURL: env.API_BASE_URL,
});

// ใช้กับ protected endpoints — inject Bearer token อัตโนมัติ
export const apiClient = new HttpClient({
  baseURL: env.API_BASE_URL,
  requestInterceptors: [authRequestInterceptor],
  responseInterceptors: [errorResponseInterceptor],
});
