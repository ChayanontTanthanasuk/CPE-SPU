# 03 — TanStack Ecosystem

TanStack คือชุดของ library ที่โปรเจคนี้ใช้หลัก ได้แก่:
- **TanStack Router** — client-side routing
- **TanStack Query** — server state & data fetching
- **TanStack Form** — form management
- **TanStack Table** — headless table

ทั้งหมดออกแบบมาให้ทำงานร่วมกับ TypeScript ได้ดีมาก

---

## ส่วนที่ 1 — TanStack Router (File-based Routing)

### 1.1 แนวคิด Routing คืออะไร

Routing คือการแมป **URL** กับ **Component** ที่จะแสดงผล  
เมื่อผู้ใช้เปลี่ยน URL → Router เลือก component ที่ถูกต้องมาแสดง

```
URL: /          → หน้าหลัก (Home)
URL: /about     → หน้าเกี่ยวกับ (About)
URL: /news/1    → หน้าข่าว ID 1
URL: /news/1/edit → หน้าแก้ไขข่าว ID 1
```

---

### 1.2 File-based Routing คืออะไร

แทนที่จะกำหนด routes ด้วยโค้ด — เราสร้าง**ไฟล์**ใน directory แล้ว router สร้าง route ให้อัตโนมัติ

```
src/app/router/routes/
├── __root.tsx          → Layout หลัก (ทุก route ผ่านที่นี่)
├── index.tsx           → URL: /
├── about.tsx           → URL: /about
├── news/
│   ├── index.tsx       → URL: /news
│   └── $id.tsx         → URL: /news/:id  (dynamic segment)
├── news.$id.edit.tsx   → URL: /news/:id/edit (dot notation)
└── _auth/              → Route group (ไม่ส่งผลต่อ URL)
    └── dashboard.tsx   → URL: /dashboard
```

---

### 1.3 สร้าง Route ใหม่

```tsx
// src/app/router/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <h1>เกี่ยวกับสาขา</h1>
    </div>
  );
}
```

หลังจากสร้างไฟล์แล้ว `bun dev` จะ regenerate `routeTree.gen.ts` อัตโนมัติ

---

### 1.4 Dynamic Routes (Parameter)

```tsx
// src/app/router/routes/news.$id.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/news/$id')({
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { id } = Route.useParams();    // string
  return <h1>ข่าว ID: {id}</h1>;
}
```

---

### 1.5 Loaders — ดึงข้อมูลก่อน render

Loader คือฟังก์ชันที่รันก่อน component แสดงผล — ดึงข้อมูลที่ต้องการล่วงหน้า

```tsx
// src/app/router/routes/news.$id.tsx
import { createFileRoute } from '@tanstack/react-router';
import { newsService } from '@/app/api/news.api';

export const Route = createFileRoute('/news/$id')({
  loader: async ({ params }) => {
    // ดึงข้อมูลก่อน render
    const news = await newsService.getById(Number(params.id));
    return { news };
  },
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { news } = Route.useLoaderData();  // ข้อมูลจาก loader
  return <h1>{news.title}</h1>;
}
```

---

### 1.6 Link และ Navigation

```tsx
import { Link, useNavigate } from '@tanstack/react-router';

// Link component — สำหรับ anchor tags
<Link to="/about">เกี่ยวกับ</Link>
<Link to="/news/$id" params={{ id: String(newsId) }}>อ่านต่อ</Link>

// Active link styling
<Link to="/about" activeProps={{ className: 'active' }}>เกี่ยวกับ</Link>

// Programmatic navigation
const navigate = useNavigate();

const handleSubmit = async () => {
  await saveData();
  navigate({ to: '/news' });                              // ไปหน้าอื่น
  navigate({ to: '/news/$id', params: { id: '1' } });   // พร้อม params
};
```

---

### 1.7 Search Params (Query String)

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { zodSearchValidator } from '@tanstack/router-zod-adapter';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().default(1),
  keyword: z.string().optional(),
});

export const Route = createFileRoute('/news')({
  validateSearch: zodSearchValidator(searchSchema),
  component: NewsListPage,
});

function NewsListPage() {
  const { page, keyword } = Route.useSearch();
  const navigate = useNavigate({ from: '/news' });

  return (
    <button onClick={() => navigate({ search: prev => ({ ...prev, page: prev.page + 1 }) })}>
      หน้าถัดไป
    </button>
  );
}
```

---

### 1.8 Root Layout

```tsx
// src/app/router/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />   {/* child routes render ที่นี่ */}
      </main>
      <Footer />
    </>
  );
}
```

---

## ส่วนที่ 2 — TanStack Query (Server State Management)

### 2.1 Server State vs Client State

| | Server State | Client State |
|---|---|---|
| ที่เก็บ | Server/Database | Browser memory |
| ตัวอย่าง | ข้อมูลจาก API | theme, modal open/close |
| ปัญหา | stale data, loading, error | ไม่ซับซ้อน |
| แก้ด้วย | **TanStack Query** | useState / Zustand |

---

### 2.2 การ Setup

```tsx
// src/app/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // ข้อมูลถือว่าใหม่ 5 นาที
      retry: 2,                    // retry 2 ครั้งถ้า error
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

---

### 2.3 useQuery — ดึงข้อมูล

```tsx
import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/app/api/news.api';

// Query Key — unique identifier สำหรับ cache
// Convention: ['resource', 'operation', { params }]
const NEWS_QUERY_KEYS = {
  all: ['news'] as const,
  list: (filters: NewsFilters) => ['news', 'list', filters] as const,
  detail: (id: number) => ['news', 'detail', id] as const,
};

function NewsListPage() {
  const {
    data,          // ข้อมูลที่ได้
    isLoading,     // ครั้งแรกที่ยังไม่มีข้อมูล
    isFetching,    // กำลัง fetch (รวม background refetch)
    isError,       // เกิด error
    error,         // error object
    refetch,       // สั่ง fetch ใหม่
  } = useQuery({
    queryKey: NEWS_QUERY_KEYS.list({ page: 1 }),
    queryFn: () => newsService.getAll(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return <NewsList items={data ?? []} />;
}
```

---

### 2.4 useMutation — ส่งข้อมูล (Create/Update/Delete)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateNewsForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateNews) => newsService.create(data),

    onSuccess: (newNews) => {
      // Invalidate cache — บังคับดึงข้อมูลใหม่
      queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.all });

      // หรือ optimistic update — อัปเดต cache โดยตรงโดยไม่รอ refetch
      queryClient.setQueryData(NEWS_QUERY_KEYS.detail(newNews.id), newNews);
    },

    onError: (error) => {
      console.error('สร้างข่าวไม่สำเร็จ:', error);
    },
  });

  const handleSubmit = (formData: CreateNews) => {
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={...}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
      {mutation.isError && <p>เกิดข้อผิดพลาด</p>}
    </form>
  );
}
```

---

### 2.5 Query Invalidation & Cache Management

```tsx
const queryClient = useQueryClient();

// Invalidate — mark as stale → refetch เมื่อมี observer
queryClient.invalidateQueries({ queryKey: ['news'] });

// Invalidate specific
queryClient.invalidateQueries({ queryKey: ['news', 'detail', newsId] });

// Remove จาก cache
queryClient.removeQueries({ queryKey: ['news'] });

// Manual update cache
queryClient.setQueryData(queryKey, newData);

// Prefetch — ดึงข้อมูลล่วงหน้า
queryClient.prefetchQuery({
  queryKey: NEWS_QUERY_KEYS.detail(id),
  queryFn: () => newsService.getById(id),
});
```

---

### 2.6 Pagination

```tsx
function NewsPaginatedList() {
  const [page, setPage] = useState(1);

  const { data, isPlaceholderData } = useQuery({
    queryKey: ['news', 'list', { page }],
    queryFn: () => newsService.getPage(page),
    placeholderData: keepPreviousData,  // แสดงข้อมูลเก่าขณะรอหน้าใหม่
  });

  return (
    <div>
      <NewsList items={data?.items ?? []} />
      <button
        onClick={() => setPage(p => p - 1)}
        disabled={page === 1}
      >
        ก่อนหน้า
      </button>
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={isPlaceholderData || !data?.hasNextPage}
      >
        ถัดไป
      </button>
    </div>
  );
}
```

---

## ส่วนที่ 3 — TanStack Form

### 3.1 แนวคิด

TanStack Form เป็น form library ที่:
- Type-safe 100%
- ไม่ re-render ทั้งหน้าเมื่อ field เปลี่ยน (performant)
- รวมกับ Zod validation ได้ดี

---

### 3.2 สร้าง Form พื้นฐาน

```tsx
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านอย่างน้อย 6 ตัวอักษร'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } satisfies LoginForm,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await authService.login(value);
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field name="email">
        {(field) => (
          <div>
            <label>อีเมล</label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map(err => (
              <p key={err} className="error">{err}</p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={state => state.canSubmit}>
        {(canSubmit) => (
          <button type="submit" disabled={!canSubmit}>
            เข้าสู่ระบบ
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
```

---

## ส่วนที่ 4 — TanStack Table

### 4.1 แนวคิด Headless Table

TanStack Table เป็น "headless" library — จัดการ logic (sorting, filtering, pagination) ให้ แต่ไม่สร้าง HTML ให้ — เราต้องสร้าง UI เอง

---

### 4.2 Column Definitions

```tsx
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';

type Student = {
  id: number;
  name: string;
  email: string;
  score: number;
};

const columnHelper = createColumnHelper<Student>();

const columns: ColumnDef<Student>[] = [
  columnHelper.accessor('id', {
    header: 'รหัส',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'ชื่อ-สกุล',
    cell: info => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('score', {
    header: 'คะแนน',
    cell: info => info.getValue().toFixed(2),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'จัดการ',
    cell: ({ row }) => (
      <button onClick={() => handleEdit(row.original)}>แก้ไข</button>
    ),
  }),
];
```

---

### 4.3 สร้าง Table Component

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';

function StudentTable({ data }: { data: Student[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' ? ' ↑' : ''}
                  {header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          ก่อนหน้า
        </button>
        <span>
          หน้า {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          ถัดไป
        </button>
      </div>
    </div>
  );
}
```

---

## แหล่งเรียนเพิ่มเติม

| หัวข้อ | แหล่ง |
|---|---|
| TanStack Router | [tanstack.com/router](https://tanstack.com/router/latest/docs) |
| TanStack Query | [tanstack.com/query](https://tanstack.com/query/latest/docs) |
| TanStack Form | [tanstack.com/form](https://tanstack.com/form/latest/docs) |
| TanStack Table | [tanstack.com/table](https://tanstack.com/table/latest/docs) |

---

## Checklist

- [ ] เข้าใจ file-based routing และสร้าง route ใหม่ได้
- [ ] ใช้ dynamic route params ได้
- [ ] เข้าใจ Server State vs Client State
- [ ] ใช้ useQuery ดึงข้อมูลและ handle loading/error ได้
- [ ] ใช้ useMutation สร้าง/แก้ไข/ลบข้อมูลได้
- [ ] เข้าใจ Query Key และ cache invalidation
- [ ] สร้าง form ด้วย TanStack Form ได้
- [ ] สร้าง table พร้อม sorting/pagination ด้วย TanStack Table ได้
