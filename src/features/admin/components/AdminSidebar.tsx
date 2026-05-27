import { Link } from '@tanstack/react-router';
import { Activity, Cpu } from 'lucide-react';

export function AdminSidebar() {
  return (
    <aside className="w-52 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-white/15">
        <div className="flex items-center gap-2.5">
          <Cpu className="size-5" />
          <div>
            <p className="font-bold text-sm leading-tight">CE-SPU</p>
            <p className="text-xs opacity-70 leading-tight">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3">
        <Link
          to="/admin/activities"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/75 hover:text-white hover:bg-white/10 transition-colors"
          activeProps={{
            style: {
              background: 'var(--sidebar-item-active-bg)',
              color: 'var(--sidebar-item-active-color)',
              boxShadow: 'var(--sidebar-item-active-shadow)',
            },
          }}
        >
          <Activity className="size-4 shrink-0" />
          กิจกรรม
        </Link>
      </nav>

      <div className="px-4 py-3 border-t border-white/15">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-white/60 hover:text-white/90 transition-colors"
        >
          ← กลับสู่เว็บหลัก
        </Link>
      </div>
    </aside>
  );
}
