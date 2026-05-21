# CE-SPU — สาขาวิชาวิศวกรรมคอมพิวเตอร์

เว็บไซต์สาขาวิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยศรีปทุม

---

## Tech Stack

| หมวด | เทคโนโลยี | เวอร์ชัน |
|---|---|---|
| UI Framework | React | 19 |
| Language | TypeScript | 5.9 |
| Bundler | Vite | 7 |
| Package Manager | **Bun** | latest |
| Routing | TanStack Router (file-based) | 1.x |
| Server State / Cache | TanStack Query | 5.x |
| Form | TanStack Form + Zod | - |
| Table | TanStack Table | 8.x |
| Styling | Tailwind CSS v4 | 4.x |
| UI Primitives | Radix UI | - |
| Icons | Lucide React | - |
| i18n | i18next + react-i18next | - |
| Linting | ESLint 9 + Prettier + Husky | - |
| Testing | Vitest | - |

---

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0  (ใช้เป็น package manager และ runtime)
- Node.js >= 20 (required โดย Vite)
- Git

---

## Getting Started

### 1. Clone repo

```bash
git clone https://github.com/ChayanontTanthanasuk/CPE-SPU.git
cd CPE-SPU
```

### 2. ติดตั้ง dependencies

```bash
bun install
```

### 3. ตั้งค่า environment

```bash
cp .env.example .env
```

แก้ไข `.env` ตามค่าที่ใช้งาน:

| Variable | ค่าตัวอย่าง | คำอธิบาย |
|---|---|---|
| `VITE_APP_TITLE` | `CE-SPU` | ชื่อแอป |
| `VITE_APP_ENV` | `development` | environment |
| `VITE_API_BASE_URL` | `http://localhost:8080` | URL ของ backend API |
| `VITE_API_BASE_VERSION` | `/api/v1` | path prefix ของ API |

### 4. รัน dev server

```bash
bun dev
```

เปิด [http://localhost:5173](http://localhost:5173)

---

## Scripts

```bash
bun dev          # รัน dev server พร้อม HMR
bun run build    # ตรวจ TypeScript + build production
bun run preview  # preview production build
bun run lint     # รัน ESLint
bun test         # รัน Vitest
```

---

## โครงสร้างโปรเจกต์

```
.
├── src/
│   ├── app/
│   │   ├── api/                  ← ⭐ API layer (single source of truth)
│   │   │   └── example.api.ts    ← ตัวอย่าง — สร้าง {name}.api.ts ที่นี่
│   │   ├── stores/
│   │   │   └── auth.store.ts     ← Zustand store เก็บ accessToken
│   │   ├── router/
│   │   │   ├── routes/           ← File-based routes (สร้างหน้าใหม่ที่นี่)
│   │   │   └── routeTree.gen.ts  ← Auto-generated (ห้ามแก้มือ)
│   │   ├── App.tsx               ← Application root
│   │   └── types.d.ts            ← Global type declarations
│   │
│   ├── features/                 ← Feature modules (self-contained)
│   │   └── {feature-name}/
│   │       ├── pages/            ← Route components
│   │       ├── views/            ← Presentational containers
│   │       ├── components/       ← Feature-specific UI
│   │       ├── hooks/            ← Custom hooks
│   │       ├── schemas/          ← Zod validation schemas
│   │       ├── constants/        ← Column defs, query keys
│   │       └── types.d.ts        ← Feature types
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   └── ui/               ← Radix+Tailwind primitives (ห้ามแก้)
│   │   ├── hooks/                ← Shared hooks
│   │   └── lib/                  ← Utility functions
│   │
│   ├── infra/
│   │   ├── http/                 ← ⭐ HTTP client + interceptors
│   │   │   ├── client.ts         ← fetch-based HttpClient class
│   │   │   ├── index.ts          ← export authClient / apiClient
│   │   │   └── interceptors/     ← auth, error interceptors
│   │   └── utils/env/            ← อ่าน VITE_* env vars
│   │
│   ├── i18n/
│   │   ├── th.json               ← ข้อความภาษาไทย
│   │   └── en.json               ← ข้อความภาษาอังกฤษ
│   │
│   └── styles/
│       └── globals.css           ← Global CSS + Tailwind
│
├── public/                       ← Static assets
├── .env.example                  ← Environment template
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── package.json
```

---

## การสร้างหน้าใหม่ (Routing)

ระบบใช้ **TanStack Router file-based routing** — การสร้างไฟล์ใน `src/app/router/routes/` จะสร้าง route อัตโนมัติ

### ตัวอย่าง: สร้างหน้า `/about`

```tsx
// src/app/router/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return <div>เกี่ยวกับสาขา</div>;
}
```

Route tree จะถูก regenerate อัตโนมัติเมื่อรัน `bun dev`

---

## การสร้าง Feature Module

```
src/features/my-feature/
├── pages/           ← Route components (lazy-loaded)
├── views/           ← Container (orchestrate hooks + components)
├── components/      ← Feature UI
├── hooks/           ← useSearchX, useSaveX ฯลฯ
├── schemas/         ← Zod schemas
├── constants/       ← query-keys.ts, column defs
└── types.d.ts       ← ใช้ `export type` เสมอ
```

**กฎสำคัญ:** Feature ต้องไม่ import ข้ามกัน — ถ้าต้องแชร์ให้ย้ายไปที่ `src/shared/`

---

## Code Style

- **Prettier**: 2-space indent, single quotes, trailing commas
- **ESLint**: import alphabetical + newline groups, unused vars ขึ้นต้น `_`
- **i18n**: ข้อความ UI ทุกตัวต้องเพิ่มใน `th.json` และ `en.json` — ห้าม hardcode string
- **Pre-commit hook**: Husky รัน `prettier + eslint --fix` อัตโนมัติก่อน commit

---

## HTTP Client & API Layer

### HTTP Client (`src/infra/http/`)

มี 2 instance:

| instance | ใช้เมื่อ | interceptors |
|---|---|---|
| `authClient` | public endpoints (login, refresh token) | ไม่มี |
| `apiClient` | protected endpoints | inject Bearer token อัตโนมัติ |

```ts
import { apiClient, authClient } from '@/infra/http';

// protected — ต้อง login ก่อน
const data = await apiClient.get<ResponseType>('/endpoint');

// public — ไม่ต้อง token
const res = await authClient.post<LoginResponse>('/auth/login', body);
```

### API Layer (`src/app/api/`)

**ทุก API call ต้องอยู่ที่ `src/app/api/{name}.api.ts` เท่านั้น** — features ไม่มี service ของตัวเอง

```ts
// src/app/api/news.api.ts
import { apiClient } from '@/infra/http';

export const newsService = {
  getAll: () => apiClient.get<News[]>('/news'),
  getById: (id: number) => apiClient.get<News>(`/news/${id}`),
  create: (body: CreateNews) => apiClient.post<News>('/news', body),
  update: (id: number, body: UpdateNews) => apiClient.put<News>(`/news/${id}`, body),
  delete: (id: number) => apiClient.delete(`/news/${id}`),
};
```

### Auth Store (`src/app/stores/auth.store.ts`)

เก็บ `accessToken` ไว้ใน Zustand — interceptor ดึงไปใส่ header อัตโนมัติ

```ts
import { useAuthStore } from '@/app/stores/auth.store';

const { setAccessToken, clearAuth } = useAuthStore();

setAccessToken('your-token');  // หลัง login สำเร็จ
clearAuth();                   // หลัง logout
```

### Environment (`src/infra/utils/env/`)

```ts
import { env } from '@/infra/utils/env';

console.log(env.API_BASE_URL); // http://localhost:8080/api/v1
```

---

## ติดต่อทีม

สาขาวิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยศรีปทุม
