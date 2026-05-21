import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b px-6 py-3 flex items-center gap-6">
        <span className="font-bold text-lg">CE-SPU</span>
        <Link to="/" className="text-sm hover:underline [&.active]:font-semibold">
          หน้าแรก
        </Link>
        <Link to="/about" className="text-sm hover:underline [&.active]:font-semibold">
          เกี่ยวกับ
        </Link>
        <Link to="/counter" className="text-sm hover:underline [&.active]:font-semibold">
          Counter
        </Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
