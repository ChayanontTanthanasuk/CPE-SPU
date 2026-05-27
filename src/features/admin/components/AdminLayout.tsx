import type { ReactNode } from 'react';

import { AdminSidebar } from './AdminSidebar';

type Props = { children: ReactNode };

export function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted/30 overflow-auto">
        <div className="p-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
