import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import type { Activity, ActivityStatus } from '@/features/admin/types';

const STATUS_LABEL: Record<ActivityStatus, string> = {
  upcoming: 'กำลังจะมาถึง',
  ongoing: 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
};

const STATUS_CLASS: Record<ActivityStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};


export const createActivityColumns = (
  onEdit: (row: Activity) => void,
  onDelete: (row: Activity) => void,
): ColumnDef<Activity>[] => [
  {
    accessorKey: 'title',
    header: 'ชื่อกิจกรรม',
    cell: ({ row }) => (
      <span className="font-medium text-sm">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'วันที่',
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.date}</span>,
  },
  {
    accessorKey: 'location',
    header: 'สถานที่',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1">{row.original.location}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CLASS[s]}`}>
          {STATUS_LABEL[s]}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => onEdit(row.original)}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    ),
  },
];
