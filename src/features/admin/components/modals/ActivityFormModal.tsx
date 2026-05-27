import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from '@tanstack/react-form';
import { X } from 'lucide-react';
import { useEffect } from 'react';

import type { Activity, ActivityFormValues, ActivityStatus } from '@/features/admin/types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Activity;
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  loading?: boolean;
};

const STATUSES: { value: ActivityStatus; label: string }[] = [
  { value: 'upcoming', label: 'กำลังจะมาถึง' },
  { value: 'ongoing', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancelled', label: 'ยกเลิก' },
];

const DEFAULT_VALUES: ActivityFormValues = {
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  location: '',
  status: 'upcoming',
};

export function ActivityFormModal({ open, onOpenChange, initial, onSubmit, loading }: Props) {
  const isEdit = !!initial;

  const form = useForm({
    defaultValues: initial
      ? { title: initial.title, description: initial.description, date: initial.date, location: initial.location, status: initial.status }
      : DEFAULT_VALUES,
    onSubmit: async ({ value }) => {
      await onSubmit(value as ActivityFormValues);
    },
  });

  useEffect(() => {
    if (open) form.reset();
  }, [open, form]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-card border rounded-xl shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Dialog.Title className="font-semibold">
              {isEdit ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรม'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded hover:bg-muted text-muted-foreground">
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <form
            className="px-6 py-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="title"
              validators={{ onChange: ({ value }) => (!value ? 'กรุณากรอกชื่อกิจกรรม' : undefined) }}
            >
              {(field) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">ชื่อกิจกรรม *</label>
                  <input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="ระบุชื่อกิจกรรม..."
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">{field.state.meta.errors[0] as string}</p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-3">
              <form.Field name="date">
                {(field) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">วันที่จัดกิจกรรม</label>
                    <input
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="status">
                {(field) => (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">สถานะ</label>
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as ActivityStatus)}
                      className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field
              name="location"
              validators={{ onChange: ({ value }) => (!value ? 'กรุณากรอกสถานที่' : undefined) }}
            >
              {(field) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">สถานที่จัดงาน *</label>
                  <input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="เช่น ห้องประชุมใหญ่ อาคาร 11"
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">{field.state.meta.errors[0] as string}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="description"
              validators={{ onChange: ({ value }) => (!value ? 'กรุณากรอกรายละเอียด' : undefined) }}
            >
              {(field) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">รายละเอียดกิจกรรม *</label>
                  <textarea
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    placeholder="ระบุรายละเอียดกิจกรรม..."
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">{field.state.meta.errors[0] as string}</p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="flex gap-2 justify-end pt-1">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-muted disabled:opacity-50"
                >
                  ยกเลิก
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มกิจกรรม'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
