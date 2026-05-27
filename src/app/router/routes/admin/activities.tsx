import { createFileRoute } from '@tanstack/react-router';

import { AdminActivitiesPage } from '@/features/admin/pages/AdminActivitiesPage';

export const Route = createFileRoute('/admin/activities')({
  component: AdminActivitiesPage,
});
