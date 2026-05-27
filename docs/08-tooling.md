# 08 — Tooling (Vite / Bun / ESLint / Prettier / Husky / Vitest)

เครื่องมือที่ใช้ในโปรเจคนี้ทุกตัวมีหน้าที่ชัดเจน — เรียนรู้ทีละตัว

---

## ส่วนที่ 1 — Bun (Package Manager & Runtime)

### 1.1 Bun คืออะไร

Bun เป็น JavaScript runtime ที่เร็วกว่า Node.js และมี package manager ในตัว  
โปรเจคนี้ใช้ Bun แทน npm/yarn/pnpm ทั้งหมด

### 1.2 คำสั่งที่ใช้บ่อย

```bash
# ติดตั้ง dependencies ทั้งหมด
bun install

# เพิ่ม package ใหม่
bun add react-icons
bun add -d @types/node     # dev dependency

# ลบ package
bun remove react-icons

# รัน script จาก package.json
bun dev
bun run build
bun test

# รัน script โดยตรง
bun run src/scripts/seed.ts
```

### 1.3 bun.lock

ไฟล์ `bun.lock` เป็น lockfile ของ Bun — **ต้อง commit ลง git เสมอ**  
ทำให้ทุกคนที่ clone repo ได้ dependencies เวอร์ชันเดียวกัน

---

## ส่วนที่ 2 — Vite (Build Tool)

### 2.1 Vite คืออะไร

Vite คือ build tool ที่:
- **Dev server**: ใช้ ES Modules โดยตรง → start ไวมาก (< 1 วินาที)
- **HMR (Hot Module Replacement)**: อัปเดตเฉพาะ module ที่เปลี่ยน ไม่ reload ทั้งหน้า
- **Production Build**: ใช้ Rollup bundler → output ที่ optimize แล้ว

### 2.2 vite.config.ts ของโปรเจค

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  plugins: [
    TanStackRouterVite(),   // auto-generate routeTree.gen.ts
    react(),                // JSX transform
  ],
  resolve: {
    alias: {
      '@': '/src',          // @/xxx → src/xxx
    },
  },
});
```

### 2.3 Environment Variables ใน Vite

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080    # ✅ เข้าถึงได้ใน client
SECRET_KEY=supersecret                     # ❌ ไม่เข้าถึงได้ใน client

# .env.development  — ใช้ตอน bun dev
# .env.production   — ใช้ตอน bun run build
# .env.local        — override ส่วนตัว (gitignored)
```

```ts
// อ่านใน code
import.meta.env.VITE_API_BASE_URL    // Vite native
// หรือผ่าน helper ของโปรเจค
import { env } from '@/infra/utils/env';
```

### 2.4 Code Splitting

Vite ทำ code splitting อัตโนมัติ — แต่ละ route lazy load ตามต้องการ

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      ← core bundle
│   ├── about-[hash].js      ← about page (lazy)
│   └── news-[hash].js       ← news page (lazy)
```

---

## ส่วนที่ 3 — ESLint (Code Quality)

### 3.1 ESLint คืออะไร

ESLint คือ linter — ตรวจหา **bug** และ **code style issues** โดยไม่ต้องรันโปรแกรม

### 3.2 Rules ที่โปรเจคนี้บังคับ

```js
// eslint.config.js — ตัวอย่าง rules
{
  // ห้ามใช้ตัวแปรที่ประกาศแล้วไม่ได้ใช้
  'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
  // ตัวแปรที่ตั้งใจไม่ใช้ ต้องขึ้นต้นด้วย _
  // เช่น: const _unused = ...

  // Import ต้องเรียงตามตัวอักษร
  'import/order': 'error',

  // ห้าม console.log ใน production code
  'no-console': 'warn',

  // TypeScript specific
  '@typescript-eslint/no-explicit-any': 'error',    // ห้ามใช้ any
  '@typescript-eslint/explicit-return-type': 'off', // ไม่บังคับ return type
}
```

### 3.3 Import Order ที่ถูกต้อง

```ts
// 1. Node.js built-ins
import path from 'path';

// [blank line]

// 2. External packages
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// [blank line]

// 3. Internal packages (@/)
import { Button } from '@/shared/components/ui/button';
import { newsService } from '@/app/api/news.api';

// [blank line]

// 4. Relative imports
import { NewsCard } from '../components/NewsCard';
import type { NewsItem } from '../types';
```

### 3.4 รัน ESLint

```bash
bun run lint          # ตรวจสอบ
bun run lint --fix    # แก้ไขอัตโนมัติ (ที่แก้ได้)
```

---

## ส่วนที่ 4 — Prettier (Code Formatting)

### 4.1 Prettier คืออะไร

Prettier คือ code formatter — ทำให้ code มีรูปแบบเดียวกันทั้งทีม  
แตกต่างจาก ESLint ตรงที่: Prettier ดูแลแค่ **format** (indent, quotes, commas)  
ไม่สนใจ logic หรือ bugs

### 4.2 Config ของโปรเจค

```json
// .prettierrc
{
  "semi": true,              // ต้องมี semicolon
  "singleQuote": true,       // ใช้ single quote
  "tabWidth": 2,             // indent 2 spaces
  "trailingComma": "all",    // trailing comma ทุกที่
  "printWidth": 100,         // ขึ้นบรรทัดใหม่ถ้าเกิน 100 ตัวอักษร
  "arrowParens": "always"    // (x) => x แทน x => x
}
```

### 4.3 ตัวอย่าง

```ts
// ก่อน Prettier format
const obj = {a:1,b:2,c:3}
const fn = (x,y) => x+y
import {useState,useEffect,useCallback} from 'react'

// หลัง Prettier format
const obj = { a: 1, b: 2, c: 3 };
const fn = (x, y) => x + y;
import { useCallback, useEffect, useState } from 'react';
```

### 4.4 VS Code Integration

ติดตั้ง Prettier extension และตั้ง format on save:

```json
// .vscode/settings.json (อยู่ใน repo แล้ว)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## ส่วนที่ 5 — Husky (Git Hooks)

### 5.1 Husky คืออะไร

Husky ทำให้ทำงาน **git hooks** ได้ง่าย — รัน script อัตโนมัติก่อน/หลัง git operations

### 5.2 Pre-commit Hook ของโปรเจค

```bash
# .husky/pre-commit
bun lint-staged
```

**`lint-staged`** จะรัน prettier + eslint เฉพาะ**ไฟล์ที่ staged** (ที่ `git add` แล้ว) เท่านั้น

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
```

### 5.3 Flow การ Commit

```bash
git add src/features/news/NewsPage.tsx
git commit -m "feat: add news listing page"

# → Husky รัน pre-commit hook
# → lint-staged ตรวจสอบ NewsPage.tsx
# → Prettier format file
# → ESLint fix issues
# → ถ้าผ่านทั้งหมด → commit สำเร็จ
# → ถ้า fail → commit ถูกยกเลิก, ต้องแก้ก่อน
```

---

## ส่วนที่ 6 — TypeScript Compiler

### 6.1 tsconfig.json ของโปรเจค

```json
// tsconfig.app.json (simplified)
{
  "compilerOptions": {
    "target": "ES2022",           // compile เป็น JavaScript เวอร์ชันไหน
    "lib": ["ES2022", "DOM"],     // type definitions ที่ใช้
    "module": "ESNext",           // module system
    "moduleResolution": "bundler",// resolution strategy (สำหรับ Vite)
    "jsx": "react-jsx",           // JSX transform
    "strict": true,               // เปิด strict mode ทั้งหมด
    "noUncheckedIndexedAccess": true, // array access อาจ undefined
    "paths": {
      "@/*": ["./src/*"]          // path alias
    }
  }
}
```

### 6.2 strict Mode หมายความว่า

```ts
// noImplicitAny — ห้ามใช้ any โดยไม่ประกาศ
function greet(name) { ... }          // ❌ Error: name has implicit any
function greet(name: string) { ... }  // ✅

// strictNullChecks — null/undefined ต้อง handle
const user: User | null = getUser();
user.name;           // ❌ Error: user might be null
user?.name;          // ✅ optional chaining
if (user) user.name; // ✅ type guard

// strictFunctionTypes — function type safety
```

---

## ส่วนที่ 7 — Vitest (Testing)

### 7.1 Vitest คืออะไร

Vitest คือ testing framework ที่สร้างมาสำหรับ Vite โดยเฉพาะ  
API เหมือน Jest แต่เร็วกว่าและ config น้อยกว่า

### 7.2 เขียน Unit Test

```ts
// src/shared/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, truncate } from '../utils';

describe('formatDate', () => {
  it('formats date to Thai locale', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('15 ม.ค. 2567');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('truncate', () => {
  it('truncates long text', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('does not truncate short text', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
});
```

### 7.3 Test React Components

```tsx
// src/features/news/__tests__/NewsCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewsCard } from '../components/NewsCard';

const mockNews = {
  id: 1,
  title: 'ทดสอบข่าว',
  content: 'เนื้อหาทดสอบ',
  category: 'academic' as const,
};

describe('NewsCard', () => {
  it('renders news title', () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText('ทดสอบข่าว')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(<NewsCard news={mockNews} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /ลบ/ }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
```

### 7.4 รัน Tests

```bash
bun test                  # รันครั้งเดียว
bun test --watch          # watch mode
bun test --coverage       # พร้อม code coverage report
bun test src/features/news # เฉพาะ folder
```

### 7.5 vitest.config.ts

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,                    // ไม่ต้อง import describe/it/expect
    environment: 'jsdom',             // simulate browser environment
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

---

## สรุปเครื่องมือ

| เครื่องมือ | หน้าที่ | เมื่อใช้ |
|---|---|---|
| **Bun** | Package manager + runtime | ทุกครั้งที่ติดตั้ง/รัน |
| **Vite** | Dev server + bundler | auto (ผ่าน `bun dev`) |
| **TypeScript** | Type checking | auto (ผ่าน VS Code + `bun run build`) |
| **ESLint** | Code quality | auto (Husky) + `bun run lint` |
| **Prettier** | Code format | auto (save + Husky) |
| **Husky** | Git hooks | auto (ทุก commit) |
| **Vitest** | Testing | `bun test` |

---

## Checklist

- [ ] ติดตั้ง Bun และใช้คำสั่ง `bun install`, `bun dev` ได้
- [ ] เข้าใจว่า Vite ทำอะไร (dev server, HMR, build)
- [ ] เข้าใจ VITE_ environment variables
- [ ] รู้ import order ที่ถูกต้องตาม ESLint config
- [ ] ตั้งค่า format on save ใน VS Code
- [ ] เข้าใจ flow ของ Husky pre-commit hook
- [ ] เขียน unit test ด้วย Vitest ได้
