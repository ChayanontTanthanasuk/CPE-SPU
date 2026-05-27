# 02 — React 19

โปรเจคนี้ใช้ **React 19** ซึ่งเป็นเวอร์ชันล่าสุด มี features ใหม่หลายอย่าง  
แต่ต้องเข้าใจ React พื้นฐานให้แน่นก่อนเสมอ

---

## ส่วนที่ 1 — React พื้นฐาน

### 1.1 Component คืออะไร

Component คือ **ฟังก์ชัน** ที่รับ `props` แล้วคืนค่า **JSX** (HTML-like syntax)

```tsx
// Functional Component
function HelloWorld() {
  return <h1>Hello, World!</h1>;
}

// ใช้ Arrow function (นิยมในโปรเจคนี้)
const HelloWorld = () => {
  return <h1>Hello, World!</h1>;
};

// Short form (single expression)
const HelloWorld = () => <h1>Hello, World!</h1>;
```

**ชื่อ component ต้องขึ้นต้นด้วยตัวใหญ่เสมอ**

---

### 1.2 JSX คืออะไร

JSX คือ syntax extension ที่ทำให้เขียน HTML-like code ใน JavaScript ได้

```tsx
// JSX — ดูเหมือน HTML แต่มีความแตกต่าง
const element = (
  <div className="container">        {/* class → className */}
    <h1 style={{ color: 'red' }}>    {/* style เป็น object */}
      ยินดีต้อนรับ
    </h1>
    <p>{2 + 2}</p>                   {/* Expression ใน {} */}
    <img src={logo} alt="Logo" />    {/* self-closing ต้องมี / */}
  </div>
);

// JSX ต้องมี root element เดียว
// ใช้ Fragment เมื่อไม่ต้องการ wrapper div
const element = (
  <>
    <h1>หัวข้อ</h1>
    <p>เนื้อหา</p>
  </>
);
```

---

### 1.3 Props

```tsx
// กำหนด type ของ props
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;    // optional
  variant?: 'primary' | 'secondary';
};

// รับ props ผ่าน destructuring
const Button = ({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// ใช้ component
<Button label="บันทึก" onClick={() => console.log('saved')} />
<Button label="ยกเลิก" onClick={handleCancel} variant="secondary" disabled={isLoading} />
```

---

### 1.4 Children

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;  // รับ JSX ลูก
};

const Card = ({ title, children }: CardProps) => (
  <div className="card">
    <h2>{title}</h2>
    <div className="card-body">{children}</div>
  </div>
);

// ใช้งาน
<Card title="ข้อมูลนักศึกษา">
  <p>ชื่อ: Alice</p>
  <p>รหัส: 65XXXXX</p>
</Card>
```

---

### 1.5 Conditional Rendering

```tsx
const UserStatus = ({ user }: { user: User | null }) => {
  // Early return
  if (!user) {
    return <p>กรุณาเข้าสู่ระบบ</p>;
  }

  return (
    <div>
      {/* Ternary */}
      {user.isAdmin ? <AdminBadge /> : <UserBadge />}

      {/* Short-circuit — render เฉพาะถ้า condition เป็น true */}
      {user.notifications > 0 && <NotificationBell count={user.notifications} />}

      {/* ใช้ null เพื่อไม่ render อะไร */}
      {user.isSuspended ? null : <Content />}
    </div>
  );
};
```

---

### 1.6 List Rendering

```tsx
const StudentList = ({ students }: { students: Student[] }) => (
  <ul>
    {students.map((student) => (
      // key ต้องไม่ซ้ำ และ stable (ใช้ id ไม่ใช้ index)
      <li key={student.id}>
        {student.name} — {student.score}
      </li>
    ))}
  </ul>
);
```

**กฎ:** ใช้ `key` ที่เป็น unique ID เสมอ ห้ามใช้ array index ถ้าหลีกเลี่ยงได้

---

## ส่วนที่ 2 — React Hooks

### 2.1 useState

```tsx
const Counter = () => {
  // State declaration: [currentValue, setter]
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  return (
    <div>
      <p>นับ: {count}</p>

      {/* Direct update */}
      <button onClick={() => setCount(count + 1)}>+</button>

      {/* Functional update — ใช้เมื่อ new state ขึ้นกับ old state */}
      <button onClick={() => setCount(prev => prev + 1)}>+1</button>

      {/* Reset */}
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};
```

**สำคัญ:** อย่า mutate state โดยตรง — ต้องสร้าง object/array ใหม่เสมอ

```tsx
// ผิด
setUser(prev => {
  prev.name = 'New Name';  // mutation!
  return prev;
});

// ถูก
setUser(prev => ({ ...prev, name: 'New Name' }));

// ผิด
setItems(prev => {
  prev.push(newItem);  // mutation!
  return prev;
});

// ถูก
setItems(prev => [...prev, newItem]);
```

---

### 2.2 useEffect

```tsx
const DataFetcher = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Effect function — รันหลัง render

    let cancelled = false; // cleanup pattern

    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data);
    });

    // Cleanup function — รันก่อน effect ครั้งถัดไป หรือก่อน unmount
    return () => {
      cancelled = true;
    };
  }, [userId]); // Dependency array — effect จะรันใหม่เมื่อ userId เปลี่ยน

  return user ? <UserCard user={user} /> : <Loading />;
};

// [] = รันครั้งเดียวตอน mount
// [dep1, dep2] = รันทุกครั้งที่ dep เปลี่ยน
// ไม่ใส่ = รันทุก render (หลีกเลี่ยง)
```

**ใน React modern:** ถ้า fetch data ให้ใช้ **TanStack Query** แทน useEffect โดยตรง

---

### 2.3 useCallback & useMemo

```tsx
const ExpensiveComponent = ({ items, onSelect }: Props) => {
  // useMemo — cache ผลลัพธ์ของการคำนวณ
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items] // คำนวณใหม่เมื่อ items เปลี่ยน
  );

  // useCallback — cache ฟังก์ชัน (ป้องกัน re-render ของ child)
  const handleSelect = useCallback(
    (id: number) => {
      onSelect(id);
    },
    [onSelect]
  );

  return (
    <ul>
      {sortedItems.map(item => (
        <Item key={item.id} item={item} onSelect={handleSelect} />
      ))}
    </ul>
  );
};
```

**แนวทาง:** อย่า optimize ก่อนที่จะมีปัญหา performance จริง ๆ

---

### 2.4 useRef

```tsx
const TextInput = () => {
  // DOM ref — เข้าถึง DOM element โดยตรง
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Mutable ref — เก็บค่าที่ไม่ trigger re-render
  const renderCount = useRef(0);
  renderCount.current += 1;

  return <input ref={inputRef} type="text" />;
};
```

---

### 2.5 useContext

```tsx
// 1. สร้าง Context
type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. สร้าง Provider
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom hook สำหรับใช้งาน
const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme ต้องใช้ภายใน ThemeProvider');
  return ctx;
};

// 4. ใช้งาน
const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
};
```

**ในโปรเจคนี้:** ใช้ **Zustand** แทน Context สำหรับ global state

---

### 2.6 Custom Hooks

```tsx
// Custom hook — ฟังก์ชันที่ขึ้นต้นด้วย "use" และใช้ built-in hooks ภายใน
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, setStoredValue] as const;
}

// ใช้งาน
const [settings, setSettings] = useLocalStorage('settings', { theme: 'light' });
```

---

## ส่วนที่ 3 — React 19 Features ใหม่

### 3.1 Server Components (แนวคิด)

React 19 ให้ component render บน server ได้  
โปรเจคนี้ยังเป็น **SPA (client-side only)** ดังนั้น concept นี้ยังไม่ใช้โดยตรง แต่ควรรู้ไว้

---

### 3.2 Actions & useFormStatus

```tsx
// React 19 Actions — form submissions ที่ handle async เอง
function SubmitButton() {
  const { pending } = useFormStatus(); // รู้ state ของ form parent

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'กำลังบันทึก...' : 'บันทึก'}
    </button>
  );
}
```

**ในโปรเจคนี้:** ใช้ **TanStack Form** จัดการ form แทน

---

### 3.3 use() Hook

```tsx
// React 19 use() — อ่านค่าจาก Promise หรือ Context ใน render
import { use } from 'react';

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // Suspense จะ catch ถ้ายังไม่เสร็จ
  return <div>{user.name}</div>;
}
```

---

### 3.4 Suspense & Error Boundary

```tsx
// Suspense — แสดง fallback ขณะรอ lazy component หรือ async data
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>

// Error Boundary — จับ error ใน component tree
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <ErrorPage />;
    return this.props.children;
  }
}
```

---

## ส่วนที่ 4 — Performance Optimization

### 4.1 React.memo

```tsx
// ป้องกัน re-render เมื่อ props ไม่เปลี่ยน
const HeavyList = React.memo(({ items }: { items: Item[] }) => {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});
```

### 4.2 Lazy Loading (Code Splitting)

```tsx
// ใช้กับ TanStack Router — auto code-splitting ในโปรเจคนี้
const LazyPage = React.lazy(() => import('./pages/HeavyPage'));
```

---

## แหล่งเรียนเพิ่มเติม

| หัวข้อ | แหล่ง |
|---|---|
| React Official Docs | [react.dev](https://react.dev) |
| React Hooks | [react.dev/reference/react](https://react.dev/reference/react) |
| React 19 What's New | [react.dev/blog](https://react.dev/blog) |
| useEffect Guide | [react.dev/learn/synchronizing-with-effects](https://react.dev/learn/synchronizing-with-effects) |

---

## Checklist

- [ ] เข้าใจ Component, Props, JSX
- [ ] เขียน conditional rendering และ list rendering ได้
- [ ] ใช้ useState, useEffect ได้
- [ ] เข้าใจ useCallback, useMemo (และรู้ว่าเมื่อไหรควรใช้)
- [ ] เขียน Custom Hook ได้
- [ ] เข้าใจ Context API
- [ ] รู้จัก Suspense และ Error Boundary
