const STEPS = [
  'Queued',
  'Cloning Repo',
  'Installing Dependencies',
  'Building',
  'Uploading',
  'Live',
] as const;

interface Props {
  currentStep?: number;
}

export function LiveDeploymentTimeline({ currentStep = 0 }: Props) {
  return (
    <div className="glass-panel p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
            Live deployment
          </p>
          <p className="text-[11px] text-slate-400">
            Real-time view of your latest rollout.
          </p>
        </div>
      </div>
      <ol className="relative flex flex-col gap-3 md:gap-4 border-l border-slate-800 pl-4 md:pl-5">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <li key={step} className="relative">
              <span
                className={[
                  'absolute -left-2.5 h-2.5 w-2.5 rounded-full border',
                  isCompleted
                    ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]'
                    : isActive
                    ? 'bg-sky-400 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)] animate-pulse'
                    : 'bg-slate-900 border-slate-700',
                ].join(' ')}
              />
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs md:text-sm font-medium text-slate-100">
                  {step}
                </p>
                {isCompleted && (
                  <span className="text-[11px] text-emerald-300/80">Done</span>
                )}
                {isActive && (
                  <span className="text-[11px] text-sky-300/80">In progress…</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

