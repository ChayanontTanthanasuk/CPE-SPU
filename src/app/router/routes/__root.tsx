import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { Toaster } from 'sonner';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const isAdmin = useRouterState({ select: (s) => s.location.pathname.startsWith('/admin') });

  return (
    <>
      <Toaster position="top-right" richColors />
      {isAdmin ? (
        <Outlet />
      ) : (
        <div className="min-h-screen bg-background text-foreground">
          <nav className="border-b px-6 py-3 flex items-center gap-6">
            <span className="font-bold text-lg">CE-SPU</span>
            <Link to="/" className="text-sm hover:underline [&.active]:font-semibold">
              หน้าแรก
            </Link>
            <Link
              to="/admin/activities"
              className="ml-auto text-sm text-muted-foreground hover:underline"
            >
              Admin ↗
            </Link>
          </nav>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
}
