
# 01 — JavaScript & TypeScript พื้นฐาน

โปรเจคนี้เขียนด้วย **TypeScript 5.9** ซึ่งเป็น superset ของ JavaScript  
ก่อนเริ่มต้องเข้าใจ JavaScript (ES6+) ให้แน่นก่อน แล้วจึงเรียน TypeScript เพิ่มเติม

---

## ส่วนที่ 1 — JavaScript ES6+ ที่จำเป็น

### 1.1 Variable Declarations

```js
var x = 1;    // เก่า — หลีกเลี่ยง (function scope, hoisting)
let y = 2;    // ใช้สำหรับตัวแปรที่เปลี่ยนค่าได้ (block scope)
const z = 3;  // ใช้สำหรับตัวแปรที่ไม่ต้องการเปลี่ยนค่า (block scope)
```

**กฎ:** ใช้ `const` เป็นหลัก เปลี่ยนเป็น `let` เมื่อต้องการ reassign เท่านั้น

---

### 1.2 Arrow Functions

```js
// Function declaration แบบเก่า
function add(a, b) {
  return a + b;
}

// Arrow function — ใช้ใน React และ TanStack ทั้งหมด
const add = (a, b) => a + b;

// กรณี body หลายบรรทัด
const greet = (name) => {
  const msg = `Hello, ${name}`;
  return msg;
};
```

Arrow function **ไม่มี `this` ของตัวเอง** — สำคัญมากใน React

---

### 1.3 Template Literals

```js
const name = 'CE-SPU';
const msg = `ยินดีต้อนรับสู่ ${name}`;       // ใช้ backtick
const multiLine = `
  บรรทัดที่ 1
  บรรทัดที่ 2
`;
```

---

### 1.4 Destructuring

```js
// Object destructuring
const user = { id: 1, name: 'Alice', role: 'admin' };
const { id, name } = user;
const { id: userId, name: userName } = user;  // rename
const { id, ...rest } = user;                 // rest

// Array destructuring
const [first, second, ...remaining] = [1, 2, 3, 4, 5];
const [, , third] = [1, 2, 3];               // ข้ามตัวแปร

// Default values
const { theme = 'light' } = settings;
```

ใช้มากใน React เช่น `const [count, setCount] = useState(0);`

---

### 1.5 Spread Operator

```js
// Copy + merge object
const base = { a: 1, b: 2 };
const extended = { ...base, c: 3 };           // { a: 1, b: 2, c: 3 }
const override = { ...base, b: 99 };          // { a: 1, b: 99 }

// Copy + merge array
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];                 // [1, 2, 3, 4, 5]

// ส่ง array เป็น arguments
Math.max(...arr1);
```

---

### 1.6 Array Methods (สำคัญมาก)

```js
const students = [
  { id: 1, name: 'Alice', score: 85 },
  { id: 2, name: 'Bob',   score: 60 },
  { id: 3, name: 'Carol', score: 92 },
];

// .map() — แปลง element ทุกตัว, คืน array ใหม่
const names = students.map(s => s.name);          // ['Alice', 'Bob', 'Carol']

// .filter() — กรอง element, คืน array ที่ผ่านเงื่อนไข
const passed = students.filter(s => s.score >= 70); // Alice, Carol

// .find() — หา element แรกที่ตรงเงื่อนไข
const alice = students.find(s => s.name === 'Alice');

// .findIndex() — หา index
const idx = students.findIndex(s => s.id === 2);   // 1

// .reduce() — สรุปค่า
const total = students.reduce((acc, s) => acc + s.score, 0); // 237

// .some() — มีอย่างน้อย 1 ตัวที่ตรงเงื่อนไข
const hasHighScore = students.some(s => s.score > 90); // true

// .every() — ทุกตัวต้องผ่านเงื่อนไข
const allPassed = students.every(s => s.score >= 50); // true

// .sort() — เรียงลำดับ (mutates ต้นฉบับ, ควร spread ก่อน)
const sorted = [...students].sort((a, b) => b.score - a.score);

// .flat() / .flatMap()
const nested = [[1, 2], [3, 4]];
nested.flat();                                      // [1, 2, 3, 4]
```

---

### 1.7 Object Methods

```js
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);     // ['a', 'b', 'c']
Object.values(obj);   // [1, 2, 3]
Object.entries(obj);  // [['a', 1], ['b', 2], ['c', 3]]

// สร้าง object จาก entries
const doubled = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v * 2])
);
```

---

### 1.8 Optional Chaining & Nullish Coalescing

```js
// Optional chaining — ป้องกัน "Cannot read property of undefined"
const city = user?.address?.city;         // undefined (ถ้า address ไม่มี)
const firstTag = post?.tags?.[0];         // access array index safely
const result = obj?.method?.();           // เรียก method safely

// Nullish coalescing — fallback เฉพาะ null/undefined
const name = user.name ?? 'Anonymous';   // ใช้ 'Anonymous' เฉพาะถ้า null/undefined
const count = data.count ?? 0;

// vs OR operator (ระวัง falsy values)
const val = 0 || 'default';              // 'default' (0 เป็น falsy!)
const val2 = 0 ?? 'default';            // 0 (0 ไม่ใช่ null/undefined)
```

---

### 1.9 Async/Await & Promises

```js
// Promise พื้นฐาน
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async/Await — อ่านง่ายกว่า
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Parallel requests
const [users, news] = await Promise.all([
  fetchUsers(),
  fetchNews(),
]);

// Promise.allSettled — ได้ผลทั้งหมดแม้บางตัว reject
const results = await Promise.allSettled([req1(), req2()]);
```

---

### 1.10 Modules (ES Modules)

```js
// Named export — export หลายตัว
export const PI = 3.14;
export function add(a, b) { return a + b; }
export type { User };  // TypeScript type export

// Default export — export หลักของไฟล์
export default function MyComponent() { ... }

// Import
import { PI, add } from './math';
import MyComponent from './MyComponent';
import * as MathUtils from './math';  // namespace import

// Dynamic import — lazy loading
const module = await import('./heavy-module');
```

---

## ส่วนที่ 2 — TypeScript

TypeScript เพิ่ม **static typing** ให้ JavaScript — ช่วยจับ error ตั้งแต่ตอน code ไม่ต้องรอ runtime

### 2.1 Basic Types

```ts
// Primitive types
let name: string = 'Alice';
let age: number = 20;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// ใน TypeScript สมัยใหม่ type inference ทำงานได้ดี
// ส่วนใหญ่ไม่ต้องระบุ type ถ้า compiler อนุมานได้
const name = 'Alice';        // TypeScript รู้ว่าเป็น string
const scores = [85, 90, 78]; // number[]
```

---

### 2.2 Array & Tuple

```ts
// Array
const names: string[] = ['Alice', 'Bob'];
const ids: Array<number> = [1, 2, 3];

// Tuple — array ที่กำหนดจำนวนและ type แต่ละตำแหน่ง
const point: [number, number] = [10, 20];
const entry: [string, number] = ['age', 25];

// useState ใน React คืน Tuple
const [count, setCount] = useState<number>(0);
```

---

### 2.3 Object Types & Interface

```ts
// Object type literal
type Point = {
  x: number;
  y: number;
};

// Interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';  // union type
  age?: number;                        // optional property
  readonly createdAt: Date;            // cannot reassign
}

// Interface extension
interface Admin extends User {
  permissions: string[];
}
```

**ในโปรเจคนี้:** ใช้ `type` เป็นหลัก (ตาม convention ของ TanStack ecosystem)

---

### 2.4 Union & Intersection Types

```ts
// Union — เป็นอย่างใดอย่างหนึ่ง
type Status = 'pending' | 'active' | 'inactive';
type ID = string | number;

// Intersection — รวมทุก property
type AdminUser = User & { permissions: string[] };

// Discriminated Union — pattern สำคัญมาก
type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
  | { status: 'loading' };

function handleResult(result: ApiResult<User>) {
  if (result.status === 'success') {
    console.log(result.data.name);  // TypeScript รู้ว่ามี .data
  }
}
```

---

### 2.5 Generics

```ts
// Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]);           // number | undefined
first(['a', 'b', 'c']);     // string | undefined

// Generic interface
interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
}

type UserResponse = ApiResponse<User>;
type UsersResponse = ApiResponse<User[]>;

// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const name = getProperty(user, 'name');  // string
```

---

### 2.6 Utility Types

```ts
// Partial — ทุก property เป็น optional
type UpdateUser = Partial<User>;

// Required — ทุก property เป็น required
type StrictUser = Required<User>;

// Pick — เลือกบาง property
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit — ตัดบาง property ออก
type CreateUser = Omit<User, 'id' | 'createdAt'>;

// Record — สร้าง object type จาก key/value types
type RolePermissions = Record<User['role'], string[]>;

// ReturnType — ดึง return type ของ function
type FetchResult = ReturnType<typeof fetchUser>;

// Parameters — ดึง parameter types ของ function
type FetchParams = Parameters<typeof fetchUser>;
```

---

### 2.7 Type Narrowing

```ts
function processValue(val: string | number) {
  if (typeof val === 'string') {
    return val.toUpperCase(); // TypeScript รู้ว่าเป็น string ในบล็อกนี้
  }
  return val.toFixed(2);     // TypeScript รู้ว่าเป็น number
}

// instanceof narrowing
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);  // มี .message
  }
}

// Type predicates
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}
```

---

### 2.8 `as const` & Enum

```ts
// as const — ทำให้ค่าเป็น literal type (readonly)
const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  NEWS: '/news',
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES]; // '/' | '/about' | '/news'

// Enum (ใช้น้อยใน modern TS, prefer union types)
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
}
```

---

### 2.9 Declaration Files (.d.ts)

```ts
// src/app/types.d.ts
declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Global type augmentation
declare global {
  interface Window {
    analytics: Analytics;
  }
}
```

---

## แหล่งเรียนเพิ่มเติม

| หัวข้อ | แหล่ง |
|---|---|
| JavaScript (ES6+) | [javascript.info](https://javascript.info) |
| TypeScript Handbook | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) |
| TypeScript Playground | [typescriptlang.org/play](https://www.typescriptlang.org/play) |
| TypeScript Exercises | [typescript-exercises.github.io](https://typescript-exercises.github.io) |

---

## Checklist ก่อนไปข้อต่อไป

- [ ] เข้าใจ `let`/`const`, arrow functions, destructuring, spread
- [ ] ใช้ `.map()`, `.filter()`, `.reduce()` ได้คล่อง
- [ ] เข้าใจ async/await และ Promise
- [ ] เข้าใจ ES Modules (import/export)
- [ ] เข้าใจ TypeScript types, interfaces, generics
- [ ] รู้จัก utility types เช่น `Partial`, `Pick`, `Omit`
