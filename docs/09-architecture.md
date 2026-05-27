# 09 — สถาปัตยกรรมโปรเจค (Feature-based Architecture)

บทนี้อธิบาย**ทำไม**โปรเจคถึงออกแบบแบบนี้ และ**ควรวางไฟล์ไว้ที่ไหน**

---

## ส่วนที่ 1 — ภาพรวมโครงสร้าง

```
src/
├── app/               ← Application-level concerns
│   ├── api/           ← ทุก API call อยู่ที่นี่
│   ├── stores/        ← Global state (Zustand)
│   ├── router/        ← Routing config
│   ├── App.tsx        ← App root
│   └── types.d.ts     ← Global types
│
├── features/          ← Feature modules (self-contained)
│   └── {feature}/
│       ├── pages/
│       ├── views/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── constants/
│       └── types.d.ts
│
├── shared/            ← สิ่งที่ใช้ร่วมกันระหว่าง features
│   ├── components/
│   │   └── ui/        ← Radix + Tailwind primitives
│   ├── hooks/
│   └── lib/           ← Utility functions
│
├── infra/             ← Infrastructure (ไม่เกี่ยวกับ business logic)
│   ├── http/          ← HTTP client
│   └── utils/env/     ← Environment variables
│
├── i18n/              ← Translation files
│   ├── th.json
│   └── en.json
│
└── styles/
    └── globals.css
```

---

## ส่วนที่ 2 — Feature Module คืออะไร

### 2.1 แนวคิด

Feature Module คือการรวม **ทุกอย่างที่เกี่ยวกับ feature หนึ่ง** ไว้ในโฟลเดอร์เดียว  
แทนที่จะจัดตาม "ประเภทของไฟล์" (components folder, hooks folder)

**แบบเดิม (ไม่ดี):**
```
src/
├── components/
│   ├── NewsList.tsx
│   ├── NewsCard.tsx
│   └── FacultyList.tsx
├── hooks/
│   ├── useNews.ts
│   └── useFaculty.ts
└── pages/
    ├── NewsPage.tsx
    └── FacultyPage.tsx
```

**แบบใหม่ Feature-based (ดีกว่า):**
```
src/features/
├── news/
│   ├── pages/NewsList.tsx, NewsDetail.tsx
│   ├── components/NewsCard.tsx
│   └── hooks/useNews.ts
└── faculty/
    ├── pages/FacultyList.tsx
    ├── components/FacultyCard.tsx
    └── hooks/useFaculty.ts
```

---

### 2.2 ชั้นใน Feature Module

```
features/news/
├── pages/         ← Route component — ต่อกับ router
├── views/         ← Container — orchestrate hooks + components
├── components/    ← Presentational UI (reusable ใน feature นี้)
├── hooks/         ← Custom hooks (logic)
├── schemas/       ← Zod schemas
├── constants/     ← query keys, column definitions
└── types.d.ts     ← TypeScript types
```

**ตัวอย่าง: Feature "news"**

```tsx
// pages/NewsListPage.tsx — เชื่อม router กับ view
export const Route = createFileRoute('/news')({
  component: NewsListPage,
});

function NewsListPage() {
  return <NewsListView />;
}
```

```tsx
// views/NewsListView.tsx — orchestrate hooks + layout
function NewsListView() {
  const { news, isLoading } = useNewsList();
  const { mutate: deleteNews } = useDeleteNews();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <NewsList items={news} onDelete={deleteNews} />
    </div>
  );
}
```

```tsx
// components/NewsList.tsx — pure UI (รับ props, ไม่ fetch เอง)
function NewsList({ items, onDelete }: NewsListProps) {
  return (
    <ul>
      {items.map(item => (
        <NewsCard key={item.id} news={item} onDelete={onDelete} />
      ))}
    </ul>
  );
}
```

```ts
// hooks/useNewsList.ts — data fetching logic
function useNewsList(params?: NewsFilters) {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.list(params),
    queryFn: () => newsService.getAll(params),
  });
}
```

---

## ส่วนที่ 3 — กฎสำคัญ

### 3.1 No Cross-Feature Imports

**Feature ต้องไม่ import จาก feature อื่น**

```ts
// features/news/components/NewsCard.tsx

// ❌ ผิด — import จาก feature อื่น
import { FacultyBadge } from '@/features/faculty/components/FacultyBadge';

// ✅ ถูก — ถ้าต้องแชร์ ย้ายไป shared/ ก่อน
import { FacultyBadge } from '@/shared/components/FacultyBadge';
```

**ทำไม?** — ถ้า feature A import จาก B และ B import จาก A = circular dependency  
และถ้าจะลบ feature A ก็ต้องไปแก้ feature B ด้วย

---

### 3.2 ทุก API Call อยู่ที่ `src/app/api/` เท่านั้น

```ts
// ❌ ผิด — fetch โดยตรงใน component หรือ hook
function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => fetch('/api/news').then(r => r.json()),
  });
}

// ✅ ถูก — ผ่าน service
function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => newsService.getAll(),
  });
}
```

**ทำไม?** — ถ้า API endpoint เปลี่ยน แก้ที่เดียวใน `news.api.ts` พอ  
ไม่ต้องไล่แก้ทุก component

---

### 3.3 Export Type เสมอ

```ts
// types.d.ts
// ❌ export ตัว interface/type ปกติ
export interface NewsItem { ... }

// ✅ ใช้ export type
export type { NewsItem };
// หรือ
export type NewsItem = { ... };
```

**ทำไม?** — TypeScript สามารถ tree-shake type-only imports ได้ดีกว่า

---

### 3.4 ห้ามแก้ Generated Files

```
src/app/router/routeTree.gen.ts    ← auto-generated โดย TanStack Router
src/shared/components/ui/**        ← generated จาก shadcn/ui
```

ถ้าต้องการเพิ่ม component ใหม่ใน `ui/` → ใช้ shadcn CLI:
```bash
bunx --bun shadcn@latest add dialog
```

---

## ส่วนที่ 4 — Data Flow

### 4.1 ทิศทางการไหลของข้อมูล

```
API / Backend
    ↓
app/api/{name}.api.ts   (service layer)
    ↓
features/{name}/hooks/  (TanStack Query hooks)
    ↓
features/{name}/views/  (orchestration)
    ↓
features/{name}/components/ (UI)
    ↓
User
```

---

### 4.2 State Flow

```
User Action (click, type)
    ↓
Component Event Handler
    ↓
┌─────────────────────────────┐
│  Client State?              │
│  → useAuthStore, etc.       │
│                             │
│  Server Action?             │
│  → useMutation → apiService │
│  → invalidate Query cache   │
└─────────────────────────────┘
    ↓
UI Re-renders
```

---

## ส่วนที่ 5 — ตัวอย่าง: สร้าง Feature ใหม่ "Faculty"

### Step 1: สร้าง API Service

```ts
// src/app/api/faculty.api.ts
import { apiClient } from '@/infra/http';
import type { Faculty, CreateFaculty } from '@/features/faculty/types';

export const facultyService = {
  getAll: () => apiClient.get<Faculty[]>('/faculty'),
  getById: (id: number) => apiClient.get<Faculty>(`/faculty/${id}`),
  create: (body: CreateFaculty) => apiClient.post<Faculty>('/faculty', body),
  update: (id: number, body: Partial<CreateFaculty>) =>
    apiClient.put<Faculty>(`/faculty/${id}`, body),
  delete: (id: number) => apiClient.delete<void>(`/faculty/${id}`),
};
```

### Step 2: สร้าง Types

```ts
// src/features/faculty/types.d.ts
export type Faculty = {
  id: number;
  name: string;
  nameEn: string;
  position: string;
  email: string;
  imageUrl?: string;
  expertise: string[];
};

export type CreateFaculty = Omit<Faculty, 'id'>;
```

### Step 3: สร้าง Schema

```ts
// src/features/faculty/schemas/faculty.schema.ts
import { z } from 'zod';

export const createFacultySchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  nameEn: z.string().min(1, 'กรุณากรอกชื่อภาษาอังกฤษ'),
  position: z.string().min(1, 'กรุณากรอกตำแหน่ง'),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  imageUrl: z.string().url().optional(),
  expertise: z.array(z.string()).default([]),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
```

### Step 4: สร้าง Query Keys

```ts
// src/features/faculty/constants/query-keys.ts
export const FACULTY_QUERY_KEYS = {
  all: ['faculty'] as const,
  list: () => ['faculty', 'list'] as const,
  detail: (id: number) => ['faculty', 'detail', id] as const,
};
```

### Step 5: สร้าง Hooks

```ts
// src/features/faculty/hooks/useFacultyList.ts
import { useQuery } from '@tanstack/react-query';
import { facultyService } from '@/app/api/faculty.api';
import { FACULTY_QUERY_KEYS } from '../constants/query-keys';

export function useFacultyList() {
  return useQuery({
    queryKey: FACULTY_QUERY_KEYS.list(),
    queryFn: () => facultyService.getAll(),
  });
}

// src/features/faculty/hooks/useDeleteFaculty.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService } from '@/app/api/faculty.api';
import { FACULTY_QUERY_KEYS } from '../constants/query-keys';

export function useDeleteFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => facultyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
    },
  });
}
```

### Step 6: สร้าง Component

```tsx
// src/features/faculty/components/FacultyCard.tsx
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { Faculty } from '../types';

type FacultyCardProps = {
  faculty: Faculty;
  onDelete: (id: number) => void;
  onEdit: (faculty: Faculty) => void;
};

export function FacultyCard({ faculty, onDelete, onEdit }: FacultyCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="font-semibold">{faculty.name}</h3>
      <p className="text-sm text-gray-500">{faculty.position}</p>
      <p className="text-sm text-blue-500">{faculty.email}</p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(faculty)}>
          <Edit size={14} className="mr-1" /> แก้ไข
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(faculty.id)}>
          <Trash2 size={14} className="mr-1" /> ลบ
        </Button>
      </div>
    </div>
  );
}
```

### Step 7: สร้าง View

```tsx
// src/features/faculty/views/FacultyListView.tsx
import { FacultyCard } from '../components/FacultyCard';
import { useFacultyList } from '../hooks/useFacultyList';
import { useDeleteFaculty } from '../hooks/useDeleteFaculty';

export function FacultyListView() {
  const { data: faculties, isLoading } = useFacultyList();
  const { mutate: deleteFaculty } = useDeleteFaculty();

  if (isLoading) return <div>กำลังโหลด...</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {faculties?.map(faculty => (
        <FacultyCard
          key={faculty.id}
          faculty={faculty}
          onDelete={deleteFaculty}
          onEdit={(f) => console.log('edit', f)}
        />
      ))}
    </div>
  );
}
```

### Step 8: สร้าง Page (Route)

```tsx
// src/app/router/routes/faculty/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { FacultyListView } from '@/features/faculty/views/FacultyListView';

export const Route = createFileRoute('/faculty/')({
  component: FacultyListPage,
});

function FacultyListPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">คณาจารย์</h1>
      <FacultyListView />
    </div>
  );
}
```

---

## ส่วนที่ 6 — Naming Conventions

| สิ่งของ | รูปแบบ | ตัวอย่าง |
|---|---|---|
| Component | PascalCase | `NewsCard`, `FacultyList` |
| Hook | camelCase + `use` prefix | `useNewsList`, `useDeleteNews` |
| Service | camelCase + `Service` suffix | `newsService`, `facultyService` |
| Type | PascalCase | `News`, `Faculty`, `CreateNewsInput` |
| Schema | camelCase + `Schema` suffix | `createNewsSchema` |
| Query Key | SCREAMING_SNAKE_CASE | `NEWS_QUERY_KEYS` |
| File | kebab-case (ตาม folder type) | `news-card.tsx`, `use-news-list.ts` |
| Route file | ตาม TanStack Router | `index.tsx`, `$id.tsx` |

---

## ส่วนที่ 7 — เมื่อไหรวางของไว้ที่ไหน

| คำถาม | คำตอบ |
|---|---|
| ใช้ใน feature เดียว | ไว้ใน `features/{feature}/` |
| ใช้หลาย feature | ย้ายไป `shared/` |
| เกี่ยวกับ routing | ไว้ใน `app/router/routes/` |
| เป็น API call | ไว้ใน `app/api/{name}.api.ts` |
| เป็น global state | ไว้ใน `app/stores/` |
| เป็น UI primitive | ใช้จาก `shared/components/ui/` |
| เป็น utility function | ไว้ใน `shared/lib/` |
| เป็น environment config | ไว้ใน `infra/utils/env/` |
| เป็น HTTP client | ไว้ใน `infra/http/` |

---

## Checklist

- [ ] เข้าใจโครงสร้าง `app/`, `features/`, `shared/`, `infra/`
- [ ] รู้ว่าแต่ละ layer ใน feature module ทำอะไร (page, view, component, hook)
- [ ] เข้าใจกฎ no cross-feature imports
- [ ] เข้าใจว่าทำไม API call ต้องอยู่ใน `app/api/`
- [ ] สร้าง feature ใหม่ตั้งแต่ต้นจนแสดงผลได้ (ทำตาม 8 steps ข้างบน)
- [ ] รู้ naming convention ของแต่ละประเภทไฟล์
