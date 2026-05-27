import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  loading?: boolean;
};

export function DeleteConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card border rounded-xl shadow-lg p-6 space-y-4 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div>
              <Dialog.Title className="font-semibold text-sm">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="text-muted-foreground text-sm mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Dialog.Close asChild>
              <button
                disabled={loading}
                className="px-4 py-2 text-sm border rounded-md hover:bg-muted disabled:opacity-50 transition-colors"
              >
                ยกเลิก
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm bg-destructive text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'กำลังลบ...' : 'ยืนยันลบ'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
