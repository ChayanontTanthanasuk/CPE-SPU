import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AdminLayout } from '@/features/admin/components/AdminLayout';

export const Route = createFileRoute('/admin')({
  component: AdminRootLayout,
});

function AdminRootLayout() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
