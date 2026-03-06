import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deployProject } from '../../services/api';

export function DeployProjectPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!repoUrl) {
      setError('Please enter a GitHub repository URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await deployProject({
        repoUrl,
        slug: slug || undefined,
      });

      const projectSlug = result.slug ?? slug ?? 'my-project';
      navigate(`/app/logs/${projectSlug}`, { state: { projectSlug } });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to start deployment.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-50">
          Deploy a new project
        </h1>
        <p className="text-xs text-slate-400">
          Point notExonium at a GitHub repository and we&apos;ll handle the
          rest.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
        <form onSubmit={handleSubmit} className="glass-panel p-5 md:p-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="repoUrl"
              className="text-xs font-medium text-slate-200"
            >
              GitHub Repository URL
            </label>
            <input
              id="repoUrl"
              type="url"
              required
              placeholder="https://github.com/you/your-frontend"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-xs font-medium text-slate-200">
              Optional slug
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus-within:border-accent-500 focus-within:ring-1 focus-within:ring-accent-500">
              <span className="font-mono text-[11px] text-slate-500">
                http://
              </span>
              <input
                id="slug"
                type="text"
                placeholder="my-project"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none text-sm text-slate-100 placeholder:text-slate-500"
              />
              <span className="font-mono text-[11px] text-slate-500">
                .localhost:8000
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              We&apos;ll generate one automatically if you leave this blank.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-500">
              Deployments run on isolated build workers with immutable outputs.
            </p>
            <button
              type="submit"
              className="btn-primary text-xs md:text-sm px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Starting…' : 'Deploy'}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <div className="glass-panel p-4">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              What happens on deploy
            </p>
            <ol className="mt-3 space-y-2.5 text-[11px] text-slate-300">
              <li>Queued → your job is placed into the deployment queue.</li>
              <li>Cloning Repo → we clone your Git repository.</li>
              <li>
                Installing Dependencies → we install dependencies using your lock
                file.
              </li>
              <li>Building → your static build runs (e.g. Vite, Next export).</li>
              <li>Uploading → we push assets to edge storage.</li>
              <li>Live → your site is served at the assigned URL.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

