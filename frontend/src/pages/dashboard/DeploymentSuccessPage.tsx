import { Link, useParams } from 'react-router-dom';

export function DeploymentSuccessPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const slug = projectSlug ?? 'my-project';
  const url = `http://${slug}.localhost:8000`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-50">
          Deployment successful
        </h1>
        <p className="text-xs text-slate-400">
          Your static site is now live on the edge.
        </p>
      </div>

      <div className="glass-panel p-6 flex flex-col items-center text-center gap-4">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500 opacity-40 blur-2xl" />
          <div className="relative h-full w-full rounded-full bg-slate-950 flex items-center justify-center border border-emerald-400/70 shadow-[0_0_25px_rgba(16,185,129,0.7)]">
            <span className="text-3xl">✓</span>
          </div>
        </div>

        <p className="text-sm text-slate-200">
          Your deployment is live at:
        </p>
        <a
          href={url}
          className="inline-flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 px-4 py-2 text-xs font-mono text-emerald-300 hover:border-emerald-400 hover:bg-slate-900 transition"
        >
          {url}
        </a>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a href={url} className="btn-primary text-xs">
            Open site
          </a>
          <Link to="/app/deploy" className="btn-outline text-xs">
            Deploy another project
          </Link>
        </div>
      </div>
    </div>
  );
}

