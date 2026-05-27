# เอกสารประกอบการศึกษา — CE-SPU Web Project

เอกสารชุดนี้รวบรวมทฤษฎีและแนวคิดที่จำเป็นสำหรับการพัฒนาโปรเจค CE-SPU Web  
ควรศึกษาตามลำดับจากบนลงล่าง

---

## สารบัญ

| ลำดับ | หัวข้อ | ไฟล์ |
|---|---|---|
| 1 | JavaScript & TypeScript พื้นฐาน | [01-javascript-typescript.md](./01-javascript-typescript.md) |
| 2 | React 19 | [02-react.md](./02-react.md) |
| 3 | TanStack Ecosystem (Router / Query / Form / Table) | [03-tanstack-ecosystem.md](./03-tanstack-ecosystem.md) |
| 4 | UI & Styling (Tailwind CSS v4 + Radix UI + Lucide) | [04-ui-styling.md](./04-ui-styling.md) |
| 5 | Validation & Forms (Zod + TanStack Form) | [05-validation-forms.md](./05-validation-forms.md) |
| 6 | State Management & HTTP Client (Zustand) | [06-state-http.md](./06-state-http.md) |
| 7 | Internationalization — i18next | [07-i18n.md](./07-i18n.md) |
| 8 | Tooling (Vite / Bun / ESLint / Prettier / Husky / Vitest) | [08-tooling.md](./08-tooling.md) |
| 9 | สถาปัตยกรรมโปรเจค (Feature-based Architecture) | [09-architecture.md](./09-architecture.md) |

---

## แผนการศึกษาแนะนำ

### สัปดาห์ที่ 1 — รากฐาน
- JavaScript พื้นฐาน: ES6+, async/await, module system
- TypeScript: types, interfaces, generics
- ติดตั้งสภาพแวดล้อม: Node.js, Bun, VS Code

### สัปดาห์ที่ 2 — React
- React fundamentals: JSX, components, props, state
- Hooks: useState, useEffect, useCallback, useMemo, useRef
- Custom Hooks

### สัปดาห์ที่ 3 — TanStack Ecosystem
- TanStack Router: file-based routing, nested routes, loaders
- TanStack Query: server state, caching, mutations
- TanStack Form + TanStack Table

### สัปดาห์ที่ 4 — UI, State, Tools
- Tailwind CSS v4 + Radix UI
- Zustand state management
- Zod validation
- i18next
- Tooling (Vite, ESLint, Vitest)

### สัปดาห์ที่ 5 — สถาปัตยกรรมและ Pattern
- Feature-based architecture
- HTTP Client pattern
- Code style และ best practices ของโปรเจคนี้

---

## ข้อกำหนดพื้นฐานก่อนเริ่ม

- มีความเข้าใจพื้นฐาน HTML, CSS
- มีความเข้าใจพื้นฐาน JavaScript (ตัวแปร, function, array, object)
- ติดตั้ง [Bun](https://bun.sh/) ≥ 1.0
- ติดตั้ง [Node.js](https://nodejs.org/) ≥ 20
- ติดตั้ง [Git](https://git-scm.com/)
- ติดตั้ง [VS Code](https://code.visualstudio.com/) + Extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin / TypeScript Extension Pack
