# 05 — Validation & Forms (Zod + TanStack Form)

โปรเจคนี้ใช้ **Zod** สำหรับ schema validation ร่วมกับ **TanStack Form** สำหรับจัดการ form state

---

## ส่วนที่ 1 — Zod

### 1.1 Zod คืออะไร

Zod คือ **schema validation library** ที่:
- สร้าง schema แล้ว **validate** ข้อมูลตาม schema นั้น
- ดึง **TypeScript type** ออกจาก schema ได้ (ไม่ต้องเขียน type ซ้ำ)
- ทำงานทั้ง client-side และ server-side

```ts
import { z } from 'zod';

// 1. สร้าง schema
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

// 2. ดึง TypeScript type
type User = z.infer<typeof UserSchema>;
// เท่ากับ: type User = { name: string; age: number; email: string; }

// 3. Validate ข้อมูล
const result = UserSchema.safeParse({ name: 'Alice', age: 20, email: 'alice@example.com' });
if (result.success) {
  console.log(result.data);  // User type
} else {
  console.log(result.error); // ZodError
}
```

---

### 1.2 Primitive Types

```ts
z.string()
z.number()
z.boolean()
z.date()
z.null()
z.undefined()
z.literal('admin')      // ค่าตายตัว
z.enum(['a', 'b', 'c']) // enum
z.any()                 // ไม่ validate
z.unknown()             // ไม่รู้ type
z.never()               // ไม่มีค่า (ใช้กับ discriminated union)
```

---

### 1.3 String Validations

```ts
z.string()
  .min(2, 'ต้องมีอย่างน้อย 2 ตัวอักษร')
  .max(100, 'ต้องไม่เกิน 100 ตัวอักษร')
  .email('อีเมลไม่ถูกต้อง')
  .url('URL ไม่ถูกต้อง')
  .uuid('UUID ไม่ถูกต้อง')
  .regex(/^[0-9]{13}$/, 'ต้องเป็นตัวเลข 13 หลัก')
  .trim()               // ตัดช่องว่างหัวท้าย
  .toLowerCase()        // แปลงเป็นตัวเล็ก
  .startsWith('TH')     // ต้องขึ้นต้นด้วย
  .endsWith('.pdf')     // ต้องลงท้ายด้วย
  .nonempty('กรุณากรอกข้อมูล')  // ห้ามว่าง
  .optional()           // string | undefined
  .nullable()           // string | null
```

---

### 1.4 Number Validations

```ts
z.number()
  .int('ต้องเป็นจำนวนเต็ม')
  .positive('ต้องเป็นบวก')
  .negative('ต้องเป็นลบ')
  .nonnegative('ต้องไม่ติดลบ')
  .min(0, 'ต้องมากกว่า 0')
  .max(100, 'ต้องน้อยกว่า 100')
  .multipleOf(5, 'ต้องหาร 5 ลงตัว')
  .finite('ต้องไม่เป็น Infinity')

// แปลง string เป็น number (สำหรับ form input)
z.coerce.number()   // "42" → 42
```

---

### 1.5 Object Schema

```ts
const NewsSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกหัวข้อ').max(200),
  content: z.string().min(1, 'กรุณากรอกเนื้อหา'),
  category: z.enum(['academic', 'activity', 'announcement']),
  publishedAt: z.date().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  authorId: z.number().int().positive(),
});

type News = z.infer<typeof NewsSchema>;

// Partial — ทุก field optional (สำหรับ Update form)
const UpdateNewsSchema = NewsSchema.partial();

// Pick เฉพาะบาง field
const NewsPreviewSchema = NewsSchema.pick({ title: true, category: true });

// Omit บาง field
const CreateNewsSchema = NewsSchema.omit({ authorId: true });

// Extend — เพิ่ม field
const NewsWithMetaSchema = NewsSchema.extend({
  viewCount: z.number().default(0),
  slug: z.string(),
});
```

---

### 1.6 Array Schema

```ts
z.array(z.string())                // string[]
z.array(z.number()).min(1)         // ต้องมีอย่างน้อย 1 element
z.array(z.number()).max(10)        // ไม่เกิน 10 element
z.array(UserSchema)                // User[]
z.tuple([z.string(), z.number()]) // [string, number]
```

---

### 1.7 Union & Discriminated Union

```ts
// Union ธรรมดา
const StringOrNumber = z.union([z.string(), z.number()]);

// Discriminated Union — validate ตาม type field
const ApiResponse = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    data: UserSchema,
  }),
  z.object({
    status: z.literal('error'),
    message: z.string(),
  }),
]);
```

---

### 1.8 Transform & Refine

```ts
// .transform() — แปลงค่าหลัง validate
const DateStringSchema = z.string().transform(str => new Date(str));

// .refine() — custom validation
const PasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],  // error อยู่ที่ field ไหน
  }
);

// .superRefine() — access ทุก field พร้อมกัน
const RangeSchema = z.object({
  from: z.number(),
  to: z.number(),
}).superRefine((data, ctx) => {
  if (data.from >= data.to) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'จากต้องน้อยกว่าถึง',
      path: ['to'],
    });
  }
});
```

---

### 1.9 ตัวอย่าง Form Schema จริง

```ts
// src/features/news/schemas/news.schema.ts
import { z } from 'zod';

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(1, 'กรุณากรอกหัวข้อข่าว')
    .max(200, 'หัวข้อต้องไม่เกิน 200 ตัวอักษร'),
  content: z
    .string()
    .min(10, 'เนื้อหาต้องมีอย่างน้อย 10 ตัวอักษร'),
  category: z.enum(['academic', 'activity', 'announcement'], {
    required_error: 'กรุณาเลือกหมวดหมู่',
  }),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;

export const updateNewsSchema = createNewsSchema.partial().extend({
  id: z.number().int().positive(),
});

export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
```

---

## ส่วนที่ 2 — TanStack Form กับ Zod

### 2.1 Setup

```tsx
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { createNewsSchema, type CreateNewsInput } from '../schemas/news.schema';

const form = useForm({
  defaultValues: {
    title: '',
    content: '',
    category: 'academic' as const,
    tags: [] as string[],
    isPublished: false,
  } satisfies CreateNewsInput,
  validatorAdapter: zodValidator(),
  validators: {
    onChange: createNewsSchema,   // validate ทุกครั้งที่ user พิมพ์
    onSubmit: createNewsSchema,   // validate ตอน submit
  },
  onSubmit: async ({ value }) => {
    await newsService.create(value);
  },
});
```

---

### 2.2 Form Fields ที่ซับซ้อน

```tsx
function NewsForm() {
  const form = useForm({ ... });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>

      {/* Text Field */}
      <form.Field
        name="title"
        validators={{ onChange: z.string().min(1, 'จำเป็น') }}
      >
        {(field) => (
          <div className="space-y-1">
            <Label>หัวข้อ *</Label>
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={field.state.meta.errors.length > 0}
            />
            {field.state.meta.isTouched && field.state.meta.errors.map((err, i) => (
              <p key={i} className="text-sm text-red-500">{err}</p>
            ))}
          </div>
        )}
      </form.Field>

      {/* Select Field */}
      <form.Field name="category">
        {(field) => (
          <div className="space-y-1">
            <Label>หมวดหมู่</Label>
            <Select
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">วิชาการ</SelectItem>
                <SelectItem value="activity">กิจกรรม</SelectItem>
                <SelectItem value="announcement">ประกาศ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      {/* Submit Button */}
      <form.Subscribe
        selector={state => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
```

---

### 2.3 Form State ที่ควรรู้จัก

```ts
field.state.value           // ค่าปัจจุบัน
field.state.meta.errors     // array ของ error messages
field.state.meta.isTouched  // user เคย interact กับ field นี้หรือยัง
field.state.meta.isDirty    // ค่าเปลี่ยนจาก defaultValue หรือยัง
field.state.meta.isValidating // กำลัง async validate

form.state.isSubmitting     // กำลัง submit
form.state.canSubmit        // submit ได้หรือไม่ (valid + not submitting)
form.state.isDirty          // form มีการเปลี่ยนแปลงหรือยัง
form.state.isValid          // form valid หรือยัง
form.reset()                // reset ค่ากลับ defaultValues
```

---

## แหล่งเรียนเพิ่มเติม

| หัวข้อ | แหล่ง |
|---|---|
| Zod Docs | [zod.dev](https://zod.dev) |
| TanStack Form Docs | [tanstack.com/form](https://tanstack.com/form/latest) |
| Zod + React Hook Form | [react-hook-form.com/get-started#SchemaValidation](https://react-hook-form.com/get-started#SchemaValidation) |

---

## Checklist

- [ ] สร้าง Zod schema สำหรับ object ที่ซับซ้อนได้
- [ ] ดึง TypeScript type จาก schema ด้วย `z.infer<>` ได้
- [ ] เขียน custom validation ด้วย `.refine()` ได้
- [ ] ใช้ `safeParse()` และ handle error ได้
- [ ] สร้าง form ด้วย TanStack Form + Zod ได้
- [ ] แสดง validation error ใต้ field ได้
- [ ] handle form submission กับ API ได้
