# 04 — UI & Styling (Tailwind CSS v4 + Radix UI + Lucide)

โปรเจคนี้ใช้ 3 layer สำหรับ UI:
1. **Tailwind CSS v4** — utility-first CSS framework
2. **Radix UI** — unstyled, accessible UI primitives
3. **Lucide React** — icon library

ทั้ง 3 ทำงานร่วมกัน: Radix ให้ component ที่ accessible, Tailwind ใช้ style, Lucide ใช้ icon

---

## ส่วนที่ 1 — Tailwind CSS v4

### 1.1 Utility-first คืออะไร

แทนที่จะเขียน CSS แยกไฟล์ — เราเพิ่ม class ลงใน HTML/JSX โดยตรง

```tsx
// แบบเก่า (CSS ปกติ)
// button.css
// .primary-btn { background: blue; color: white; padding: 8px 16px; ... }

// <button className="primary-btn">คลิก</button>

// แบบ Tailwind
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  คลิก
</button>
```

---

### 1.2 Class ที่ใช้บ่อยที่สุด

#### Layout

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">...</div>
<div class="flex flex-col gap-2">...</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">...</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">...</div>

<!-- Width & Height -->
<div class="w-full h-screen">...</div>
<div class="w-64 h-16">...</div>           <!-- fixed size -->
<div class="max-w-4xl mx-auto">...</div>   <!-- container centered -->
```

#### Spacing

```html
<!-- Padding -->
<div class="p-4">    <!-- ทุกด้าน: 1rem -->
<div class="px-6 py-3">  <!-- horizontal: 1.5rem, vertical: 0.75rem -->
<div class="pt-8 pb-4">  <!-- top: 2rem, bottom: 1rem -->

<!-- Margin -->
<div class="m-4 mx-auto mt-8 mb-2">
```

#### Typography

```html
<h1 class="text-3xl font-bold text-gray-900">หัวข้อใหญ่</h1>
<p class="text-base text-gray-600 leading-relaxed">เนื้อหา</p>
<span class="text-sm font-medium text-blue-500">ลิงก์</span>
```

#### Colors & Background

```html
<div class="bg-white text-gray-900">...</div>
<div class="bg-blue-500 text-white">...</div>
<div class="bg-gray-100 border border-gray-200">...</div>
```

#### Borders & Rounded

```html
<div class="border border-gray-300 rounded-lg">...</div>
<div class="border-2 border-blue-500 rounded-full">...</div>
<div class="divide-y divide-gray-200">...</div>  <!-- เส้นระหว่าง children -->
```

#### States

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-600 transition-colors">...</button>

<!-- Focus -->
<input class="border focus:outline-none focus:ring-2 focus:ring-blue-500">

<!-- Disabled -->
<button class="disabled:opacity-50 disabled:cursor-not-allowed">...</button>
```

---

### 1.3 Responsive Design (Breakpoints)

Tailwind ใช้ mobile-first approach — ไม่มี prefix = ทุก size, มี prefix = ขนาดนั้นขึ้นไป

| Prefix | Min Width | Device |
|---|---|---|
| (none) | 0 | Mobile |
| `sm:` | 640px | Small |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large Desktop |
| `2xl:` | 1536px | Extra Large |

```html
<!-- Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Hidden on mobile, visible on desktop -->
<nav class="hidden lg:flex">...</nav>

<!-- Font size ตาม screen -->
<h1 class="text-2xl md:text-4xl lg:text-5xl">...</h1>
```

---

### 1.4 Dark Mode

Tailwind v4 รองรับ dark mode ด้วย `dark:` prefix

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <p class="text-gray-600 dark:text-gray-300">เนื้อหา</p>
</div>
```

---

### 1.5 Tailwind CSS v4 — สิ่งที่เปลี่ยนจาก v3

```css
/* globals.css — v4 ใช้ CSS-native approach */
@import "tailwindcss";

/* Custom tokens ใช้ CSS variables แทน tailwind.config.js */
@theme {
  --color-brand: oklch(0.5 0.2 250);
  --font-sans: 'Sarabun', sans-serif;
  --radius-card: 0.5rem;
}
```

```html
<!-- ใช้ custom token -->
<div class="bg-brand text-brand font-sans rounded-card">
```

---

### 1.6 cn() utility — รวม class อย่างปลอดภัย

โปรเจคนี้ใช้ `cn()` จาก `src/shared/lib/` สำหรับรวม Tailwind classes

```tsx
import { cn } from '@/shared/lib/utils';

// ปัญหา: string concatenation ทำให้ class ขัดกัน
const cls = `text-red-500 ${isActive ? 'text-blue-500' : ''}`;
// ผล: "text-red-500 text-blue-500" — ขัดกัน!

// แก้ด้วย cn() (ใช้ tailwind-merge ภายใน)
const cls = cn('text-red-500', isActive && 'text-blue-500');
// ผล: "text-blue-500" — ถูกต้อง

// ใช้งานจริง
const buttonClass = cn(
  'px-4 py-2 rounded font-medium transition-colors',
  variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
  variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  disabled && 'opacity-50 cursor-not-allowed',
);
```

---

## ส่วนที่ 2 — Radix UI

### 2.1 แนวคิด Unstyled Primitives

Radix UI ให้ component ที่:
- **Accessible** — keyboard navigation, ARIA attributes, screen reader
- **Unstyled** — ไม่มี CSS ให้ เราต้องใส่ Tailwind เอง
- **Composable** — ประกอบจาก sub-components

Component ของ Radix อยู่ที่ `src/shared/components/ui/` — **ห้ามแก้ไขไฟล์เหล่านี้**

---

### 2.2 Component ที่มีอยู่และวิธีใช้

**Button**
```tsx
import { Button } from '@/shared/components/ui/button';

<Button variant="default">บันทึก</Button>
<Button variant="destructive">ลบ</Button>
<Button variant="outline">ยกเลิก</Button>
<Button variant="ghost">ดู</Button>
<Button size="sm">เล็ก</Button>
<Button size="lg">ใหญ่</Button>
<Button disabled>ปิดการใช้งาน</Button>
<Button isLoading>กำลังโหลด</Button>
```

**Input**
```tsx
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">อีเมล</Label>
  <Input id="email" type="email" placeholder="กรอกอีเมล" />
</div>
```

**Dialog (Modal)**
```tsx
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogTrigger,
} from '@/shared/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>เปิด Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>ยืนยันการลบ</DialogTitle>
      <DialogDescription>ต้องการลบรายการนี้หรือไม่?</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">ยกเลิก</Button>
      <Button variant="destructive">ลบ</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Select**
```tsx
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="เลือกสาขา" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="ce">วิศวกรรมคอมพิวเตอร์</SelectItem>
    <SelectItem value="ee">วิศวกรรมไฟฟ้า</SelectItem>
  </SelectContent>
</Select>
```

**Dropdown Menu**
```tsx
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">จัดการ</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>แก้ไข</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleDelete} className="text-red-500">
      ลบ
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Toast (Notification)**
```tsx
import { useToast } from '@/shared/components/ui/use-toast';

function MyComponent() {
  const { toast } = useToast();

  const handleSave = async () => {
    await save();
    toast({
      title: 'บันทึกสำเร็จ',
      description: 'ข้อมูลได้รับการบันทึกแล้ว',
    });
  };
}
```

---

## ส่วนที่ 3 — Lucide React (Icons)

### 3.1 วิธีใช้

```tsx
import { Search, Plus, Trash2, Edit, ChevronRight, X, Check } from 'lucide-react';

// Icon พื้นฐาน
<Search />

// ปรับขนาดและสี
<Search size={20} className="text-gray-500" />
<Plus size={24} strokeWidth={2.5} />

// ใช้กับ Button
<Button>
  <Plus size={16} className="mr-2" />
  เพิ่มรายการ
</Button>

// Icon ขนาดต่างๆ
<Search className="h-4 w-4" />    // 16px
<Search className="h-5 w-5" />    // 20px
<Search className="h-6 w-6" />    // 24px
```

### 3.2 Icon ที่ใช้บ่อย

| Icon | Component | ใช้เมื่อ |
|---|---|---|
| 🔍 | `Search` | ค้นหา |
| ➕ | `Plus` | เพิ่ม |
| ✏️ | `Edit` / `Pencil` | แก้ไข |
| 🗑️ | `Trash2` | ลบ |
| ❌ | `X` | ปิด/ยกเลิก |
| ✅ | `Check` | ยืนยัน |
| ← | `ChevronLeft` | ย้อนกลับ |
| → | `ChevronRight` | ถัดไป |
| ⬆️ | `ChevronUp` | พับ |
| ⬇️ | `ChevronDown` | ขยาย |
| ⚙️ | `Settings` | ตั้งค่า |
| 👤 | `User` | ผู้ใช้ |
| 🔔 | `Bell` | การแจ้งเตือน |
| 📁 | `Folder` | โฟลเดอร์ |
| 📄 | `FileText` | เอกสาร |
| 🏠 | `Home` | หน้าหลัก |
| 📊 | `BarChart` | กราฟ |
| 🔒 | `Lock` | ล็อค |
| 🔓 | `Unlock` | ปลดล็อค |
| ↩️ | `LogOut` | ออกจากระบบ |

---

## แหล่งเรียนเพิ่มเติม

| หัวข้อ | แหล่ง |
|---|---|
| Tailwind CSS Docs | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Tailwind CSS v4 Migration | [tailwindcss.com/docs/v4-beta](https://tailwindcss.com/docs/v4-beta) |
| Radix UI Docs | [radix-ui.com](https://www.radix-ui.com/primitives) |
| Lucide Icons | [lucide.dev](https://lucide.dev/icons/) |
| Shadcn/ui (base ของ component) | [ui.shadcn.com](https://ui.shadcn.com) |

---

## Checklist

- [ ] เข้าใจ utility-first CSS ของ Tailwind
- [ ] ใช้ flexbox และ grid ผ่าน Tailwind ได้
- [ ] ทำ responsive design ด้วย breakpoint prefixes ได้
- [ ] ใช้ `cn()` รวม class ได้
- [ ] ใช้ Button, Input, Dialog, Select จาก `shared/components/ui` ได้
- [ ] ค้นหาและใช้ Lucide icons ได้
