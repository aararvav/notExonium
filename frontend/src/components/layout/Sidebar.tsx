import { NavLink, Link } from 'react-router-dom';
import type { ReactNode } from 'react';

const navItems: { label: string; to: string; icon: ReactNode }[] = [
  { label: 'Dashboard', to: '/app', icon: <span className="text-lg">◦</span> },
  { label: 'Deploy Project', to: '/app/deploy', icon: <span className="text-lg">↑</span> },
  { label: 'Deployments', to: '/app', icon: <span className="text-lg">▣</span> },
  { label: 'Settings', to: '#', icon: <span className="text-lg">⚙</span> },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <Link
        to="/"
        className="flex items-center gap-2 px-6 h-16 border-b border-slate-800/80 hover:bg-slate-900/40 transition"
      >
        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/40" />
        <div>
          <p className="text-sm font-semibold tracking-tight text-slate-50">
            notExonium
          </p>
          <p className="text-[11px] text-slate-400">Static deployments, instant.</p>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                'text-slate-300 hover:bg-slate-800/70 hover:text-slate-50',
                isActive && 'bg-slate-800 text-slate-50 shadow-sm',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900/70 text-slate-400">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-4 mt-auto">
        <div className="glass-panel px-3.5 py-3.5 flex items-center justify-between text-xs text-slate-300">
          <div>
            <p className="font-medium">Usage</p>
            <p className="text-[11px] text-slate-400">3 of 50 deployments</p>
          </div>
          <button className="inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-700">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}

