import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { activitiesService } from '@/app/api/activities.api';

import { adminQueryKeys } from '../constants/query-keys';
import type { ActivityFormValues } from '../types';

export function useActivitiesList() {
  return useQuery({
    queryKey: adminQueryKeys.activities.all,
    queryFn: activitiesService.getAll,
  });
}

export function useActivitiesStats() {
  return useQuery({
    queryKey: adminQueryKeys.activities.stats,
    queryFn: activitiesService.getStats,
  });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ActivityFormValues) => activitiesService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminQueryKeys.activities.all });
      qc.invalidateQueries({ queryKey: adminQueryKeys.activities.stats });
      toast.success('เพิ่มกิจกรรมสำเร็จ');
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่'),
  });
}

export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<ActivityFormValues> }) =>
      activitiesService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminQueryKeys.activities.all });
      toast.success('แก้ไขกิจกรรมสำเร็จ');
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่'),
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activitiesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminQueryKeys.activities.all });
      qc.invalidateQueries({ queryKey: adminQueryKeys.activities.stats });
      toast.success('ลบกิจกรรมสำเร็จ');
    },
    onError: () => toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่'),
  });
}
