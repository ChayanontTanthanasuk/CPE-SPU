# 06 — State Management & HTTP Client (Zustand + Fetch)

โปรเจคนี้แยก state ออกเป็น 2 ประเภท:
- **Server State** (ข้อมูลจาก API) → จัดการด้วย **TanStack Query** (ดูบทที่ 3)
- **Client State** (UI state, auth token) → จัดการด้วย **Zustand**

---

## ส่วนที่ 1 — Zustand (Client State Management)

### 1.1 ทำไมต้องมี Global State?

ปัญหา **Prop Drilling** — ต้องส่ง props ผ่านหลาย layer

```
App
└── Layout
    └── Navbar
        └── UserMenu
            └── Avatar  ← ต้องการ user data
```

ถ้า `user` อยู่ใน `App` ต้องส่งผ่านทุก component — ยุ่งยากและแก้ไขยาก

**แก้ด้วย Global Store** — component ไหนก็ดึงโดยตรงได้เลย

---

### 1.2 Zustand พื้นฐาน

```ts
// src/app/stores/auth.store.ts
import { create } from 'zustand';

type AuthStore = {
  // State
  accessToken: string | null;
  user: User | null;

  // Actions
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  accessToken: null,
  user: null,

  // Actions
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
```

---

### 1.3 ใช้งาน Store ใน Component

```tsx
// อ่านค่า (subscribe เฉพาะ field ที่ใช้ — efficient!)
const accessToken = useAuthStore(state => state.accessToken);
const user = useAuthStore(state => state.user);

// อ่านหลาย field
const { accessToken, user } = useAuthStore(state => ({
  accessToken: state.accessToken,
  user: state.user,
}));

// เรียก action
const setAccessToken = useAuthStore(state => state.setAccessToken);
const clearAuth = useAuthStore(state => state.clearAuth);

// ใช้งานจริง — หลัง login
const handleLogin = async (credentials: LoginForm) => {
  const response = await authService.login(credentials);
  setAccessToken(response.accessToken);
};

// logout
const handleLogout = () => {
  clearAuth();
  navigate({ to: '/login' });
};
```

---

### 1.4 Zustand กับ Persistence (เก็บไว้แม้ reload)

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SettingsStore = {
  language: 'th' | 'en';
  theme: 'light' | 'dark';
  setLanguage: (lang: 'th' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'th',
      theme: 'light',
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ce-spu-settings',               // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

### 1.5 Zustand กับ Computed Values

```ts
import { create } from 'zustand';

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  // Getters (computed)
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => set(state => ({ items: [...state.items, item] })),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

  // ใช้ get() เพื่อเข้าถึง state ปัจจุบัน
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  itemCount: () => get().items.length,
}));

// ใช้งาน
const total = useCartStore(state => state.total());
```

---

## ส่วนที่ 2 — HTTP Client

### 2.1 โครงสร้าง HTTP Layer

โปรเจคนี้มี HTTP client ที่ `src/infra/http/` ซึ่งประกอบด้วย:

```
src/infra/http/
├── client.ts          ← HttpClient class (fetch-based)
├── index.ts           ← export authClient และ apiClient
└── interceptors/
    ├── auth.ts        ← เพิ่ม Authorization header อัตโนมัติ
    └── error.ts       ← จัดการ error response (401, 500 ฯลฯ)
```

---

### 2.2 สองรูปแบบ Client

| | `authClient` | `apiClient` |
|---|---|---|
| ใช้สำหรับ | Public endpoints (login, register) | Protected endpoints |
| Authorization header | ไม่มี | เพิ่ม `Bearer <token>` อัตโนมัติ |
| Error handling | พื้นฐาน | จัดการ 401 (auto logout/refresh) |

```ts
import { apiClient, authClient } from '@/infra/http';

// Public — ไม่ต้อง token
const response = await authClient.post<LoginResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password',
});

// Protected — ต้อง login ก่อน (token ถูกเพิ่มให้อัตโนมัติ)
const news = await apiClient.get<News[]>('/news');
const created = await apiClient.post<News>('/news', newsData);
const updated = await apiClient.put<News>(`/news/${id}`, updateData);
await apiClient.delete(`/news/${id}`);
```

---

### 2.3 API Layer — ทุก call ต้องอยู่ที่ `src/app/api/`

```ts
// src/app/api/news.api.ts
import { apiClient } from '@/infra/http';

type GetNewsParams = {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
};

export const newsService = {
  getAll: (params?: GetNewsParams) =>
    apiClient.get<PaginatedResponse<News>>('/news', { params }),

  getById: (id: number) =>
    apiClient.get<News>(`/news/${id}`),

  create: (body: CreateNewsInput) =>
    apiClient.post<News>('/news', body),

  update: (id: number, body: UpdateNewsInput) =>
    apiClient.put<News>(`/news/${id}`, body),

  delete: (id: number) =>
    apiClient.delete<void>(`/news/${id}`),
};
```

---

### 2.4 Environment Variables

ค่า API URL อ่านจาก `.env` ผ่าน `src/infra/utils/env/`

```ts
// .env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_BASE_VERSION=/api/v1

// ใช้งาน
import { env } from '@/infra/utils/env';
console.log(env.API_BASE_URL);  // http://localhost:8080/api/v1
```

**สำคัญ:** ใน Vite ทุก environment variable ต้องขึ้นต้นด้วย `VITE_` ถึงจะเข้าถึงได้จาก client-side

---

### 2.5 Error Handling Pattern

```ts
// API call ที่ดี — handle error แบบ type-safe
async function loadNews(id: number) {
  try {
    const news = await newsService.getById(id);
    return { success: true, data: news };
  } catch (error) {
    if (error instanceof ApiError) {
      // API บอก error ชัดเจน (4xx, 5xx)
      return { success: false, message: error.message };
    }
    // Network error, timeout ฯลฯ
    return { success: false, message: 'ไม่สามารถเชื่อมต่อได้' };
  }
}

// ใน TanStack Query — error จัดการโดย query.isError
const query = useQuery({
  queryKey: ['news', id],
  queryFn: () => newsService.getById(id),
  retry: (failureCount, error) => {
    // อย่า retry ถ้าเป็น 404
    if (error instanceof ApiError && error.status === 404) return false;
    return failureCount < 2;
  },
});
```

---

### 2.6 Auth Flow (Token Management)

```
1. User login → POST /auth/login → ได้ accessToken + refreshToken
2. เก็บ accessToken ใน Zustand (auth.store.ts)
3. ทุก request → interceptor เพิ่ม Authorization: Bearer <token>
4. Token หมดอายุ → interceptor ดักจับ 401
5. ส่ง refreshToken ไปขอ accessToken ใหม่ → POST /auth/refresh
6. ถ้า refresh ไม่ได้ → clearAuth() → redirect ไปหน้า login
```

---

## แหล่งเรียนเพิ่มเติม

| หัวข้อ | แหล่ง |
|---|---|
| Zustand Docs | [docs.pmnd.rs/zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) |
| Fetch API MDN | [developer.mozilla.org/en-US/docs/Web/API/Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) |
| JWT Authentication | [jwt.io/introduction](https://jwt.io/introduction/) |

---

## Checklist

- [ ] เข้าใจ Server State vs Client State
- [ ] สร้าง Zustand store ได้
- [ ] ดึงค่าจาก store เฉพาะ field ที่ต้องการ (selective subscription)
- [ ] เรียก action จาก store ได้
- [ ] เข้าใจความแตกต่างของ `authClient` และ `apiClient`
- [ ] สร้าง API service ใน `src/app/api/` ได้
- [ ] เข้าใจ Auth Flow และ token management
