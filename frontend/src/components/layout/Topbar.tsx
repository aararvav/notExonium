export function Topbar() {
  return (
    <header className="flex items-center justify-between h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
        <span>All systems operational</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:inline-flex items-center rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:bg-slate-800">
          Changelog
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600/70 flex items-center justify-center text-xs font-semibold text-slate-100">
          AK
        </div>
      </div>
    </header>
  );
}

