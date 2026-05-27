import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AdminDataTable } from '../components/AdminDataTable';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { ActivityFormModal } from '../components/modals/ActivityFormModal';
import { createActivityColumns } from '../constants/activity-columns';
import { useActivitiesList, useCreateActivity, useDeleteActivity, useUpdateActivity } from '../hooks/useActivities';
import type { Activity, ActivityFormValues } from '../types';

export function ActivitiesListView() {
  const { data: activityList, isLoading } = useActivitiesList();
  const { mutateAsync: createActivity, isPending: creating } = useCreateActivity();
  const { mutateAsync: updateActivity, isPending: updating } = useUpdateActivity();
  const { mutateAsync: deleteActivity, isPending: deleting } = useDeleteActivity();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Activity | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Activity | undefined>();

  const handleEdit = (row: Activity) => {
    setEditTarget(row);
    setFormOpen(true);
  };

  const handleDelete = (row: Activity) => {
    setDeleteTarget(row);
  };

  const handleFormSubmit = async (values: ActivityFormValues) => {
    if (editTarget) {
      await updateActivity({ id: editTarget.id, body: values });
    } else {
      await createActivity(values);
    }
    setFormOpen(false);
    setEditTarget(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteActivity(deleteTarget.id);
    setDeleteTarget(undefined);
  };

  const columns = useMemo(() => createActivityColumns(handleEdit, handleDelete), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">กิจกรรม</h1>
          <p className="text-sm text-muted-foreground mt-0.5">จัดการกิจกรรมและงานของสาขา</p>
        </div>
        <button
          onClick={() => { setEditTarget(undefined); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" />
          เพิ่มกิจกรรม
        </button>
      </div>

      {isLoading ? (
        <div className="border rounded-lg p-8 text-center text-sm text-muted-foreground animate-pulse">
          กำลังโหลด...
        </div>
      ) : (
        <AdminDataTable
          data={activityList ?? []}
          columns={columns}
          searchPlaceholder="ค้นหากิจกรรม..."
        />
      )}

      <ActivityFormModal
        key={editTarget?.id ?? 'new'}
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditTarget(undefined); }}
        initial={editTarget}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(undefined); }}
        title={`ลบกิจกรรม "${deleteTarget?.title ?? ''}" ?`}
        description="การลบจะไม่สามารถกู้คืนได้"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
