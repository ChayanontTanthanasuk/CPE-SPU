import { apiClient, authClient } from '@/infra/http';

// ตัวอย่าง type (ย้ายไปไว้ใน features/{name}/types.d.ts จริงๆ)
export type LoginRequest = { email: string; password: string };
export type LoginResponse = { accessToken: string };

// ตัวอย่าง service — ทุก API file อยู่ที่ src/app/api/ เท่านั้น
export const exampleService = {
  // public endpoint — ใช้ authClient (ไม่มี Bearer token)
  login: (body: LoginRequest) => authClient.post<LoginResponse>('/auth/login', body),

  // protected endpoint — ใช้ apiClient (inject Bearer token อัตโนมัติ)
  getProfile: () => apiClient.get<{ id: number; name: string }>('/me'),
};
