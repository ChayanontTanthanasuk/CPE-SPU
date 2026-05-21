import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/counter')({
  component: CounterPage,
});

function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-sm mx-auto text-center space-y-6 py-10">
      <h1 className="text-3xl font-bold">Counter</h1>
      <p className="text-muted-foreground text-sm">ตัวอย่าง useState</p>

      <div className="text-6xl font-mono font-bold py-6">{count}</div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="px-5 py-2 border rounded-md text-sm font-medium hover:bg-muted"
        >
          -1
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-5 py-2 border rounded-md text-sm font-medium hover:bg-muted"
        >
          Reset
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
        >
          +1
        </button>
      </div>
    </div>
  );
}
