import { Link, useNavigate } from 'react-router-dom';
import { LiveDeploymentTimeline } from '../components/ui/LiveDeploymentTimeline';

export function LandingPage() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient bg-slate-950 text-slate-50">
      <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-8">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/40 group-hover:shadow-emerald-400/60 transition-shadow" />
            <span className="text-sm font-semibold tracking-tight">
              notExonium
            </span>
          </button>
          <div className="flex items-center gap-6 text-xs md:text-sm">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="text-slate-300 hover:text-slate-50"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('live-deployment')}
              className="hidden md:inline-flex text-slate-300 hover:text-slate-50"
            >
              Live deployment
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hidden md:inline-flex text-slate-300 hover:text-slate-50"
            >
              How it works
            </button>
            <Link
              to="/auth"
              className="btn-primary text-xs md:text-sm px-4 py-1.5"
            >
              Login
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="mt-12 md:mt-20 space-y-20 md:space-y-24">
          <section
            id="hero"
            className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/5 px-2.5 py-1 text-[11px] font-medium text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,0.35)]">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              New: zero‑config static deployments
            </div>

            <h1 className="mt-5 text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-50">
              Deploy your frontend projects{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                instantly
              </span>
              .
            </h1>

            <p className="mt-4 text-sm md:text-base text-slate-300/90 max-w-xl">
              notExonium is a static site deployment platform built for modern
              frontend teams. Connect your repo, push to main, and ship
              production‑grade deployments in seconds.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary text-sm px-8 py-2.5"
              >
                Start Deploying
              </button>
            </div>
          </section>

          {/* Live deployment section */}
          <section
            id="live-deployment"
            className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-emerald-300 uppercase">
                Live deployment
              </p>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Watch every deploy roll out in real time.
              </h2>
              <p className="text-sm text-slate-300/90">
                notExonium streams build and deploy logs directly from your
                workers, so you can see exactly what&apos;s happening from
                <span className="font-medium text-slate-100">
                  {' '}
                  Queued
                </span>{' '}
                to{' '}
                <span className="font-medium text-slate-100">
                  Live
                </span>
                . Debug failed builds faster and ship with confidence.
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] text-slate-400">
                <li>• Terminal-style output updated over WebSockets.</li>
                <li>• Visual timeline from cloning to edge upload.</li>
                <li>• Immutable, timestamped deployments for every commit.</li>
              </ul>
            </div>

            <LiveDeploymentTimeline currentStep={3} />
          </section>

          {/* How it works section */}
          <section
            id="how-it-works"
            className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-sky-300 uppercase">
                How it works
              </p>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                From repo to production URL in three steps.
              </h2>
              <p className="text-sm text-slate-300/90">
                You bring a GitHub repository. We handle build orchestration,
                asset optimization, and global static hosting—without YAML
                sprawl or custom pipelines.
              </p>
              <p className="text-[11px] text-slate-400">
                Built to feel familiar if you&apos;ve used platforms like Vercel
                or Netlify, but tuned specifically for frontend teams shipping
                static sites.
              </p>
            </div>

            <div className="glass-panel p-4 md:p-5">
              <p className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                How it works
              </p>
              <ol className="mt-3 space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[11px] text-slate-200">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-slate-100">
                      Connect your repository
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Authorize GitHub and pick the project you want to deploy.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[11px] text-slate-200">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-slate-100">
                      Build runs automatically
                    </p>
                    <p className="text-[11px] text-slate-400">
                      We install dependencies, run your build, and stream logs
                      live.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[11px] text-slate-200">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-slate-100">Your site goes live</p>
                    <p className="text-[11px] text-slate-400">
                      Get a production URL like{' '}
                      <span className="font-mono text-emerald-300">
                        my-app.localhost:8000
                      </span>{' '}
                      instantly.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Extra spacing for this row on small screens */}
            <div className="md:hidden" />
          </section>

          {/* Extra value section */}
          <section id="features" className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-violet-300 uppercase">
                Built for modern frontend teams
              </p>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                Opinionated defaults, zero boilerplate.
              </h2>
              <p className="text-sm text-slate-300/90 max-w-2xl">
                notExonium ships with sensible defaults for static sites—Vite,
                Next.js export, and other SPA/MPA stacks. No custom runners, no
                bespoke config files. Just push and deploy.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-panel p-4">
                <p className="text-xs font-medium text-slate-300">
                  Instant previews
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Spin up preview URLs for every branch to share with product,
                  design, and QA before merging.
                </p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-xs font-medium text-slate-300">
                  Git-native workflow
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Your git history is your deployment history. Roll back to any
                  previous commit in one click.
                </p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-xs font-medium text-slate-300">
                  Team ready
                </p>
                <p className="mt-1 text:[11px] text-slate-400">
                  Workspaces, environments, and sensible limits so your team can
                  move quickly without surprises.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-16 md:mt-20 border-t border-slate-800/80 pt-7 pb-8 text-[11px] text-slate-500">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-md shadow-emerald-500/40" />
                <span className="text-xs font-semibold tracking-tight text-slate-100">
                  notExonium
                </span>
              </button>
              <p className="max-w-xs text-[11px] text-slate-500">
                A static deployment platform for teams who care about DX as much
                as uptime.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-300 uppercase">
                  Product
                </p>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="block text-left text-slate-400 hover:text-slate-100"
                >
                  Features
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="block text-left text-slate-400 hover:text-slate-100"
                >
                  How it works
                </button>
                <button className="block text-left text-slate-400 hover:text-slate-100">
                  Changelog
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-300 uppercase">
                  Company
                </p>
                <button className="block text-left text-slate-400 hover:text-slate-100">
                  About
                </button>
                <button className="block text-left text-slate-400 hover:text-slate-100">
                  Blog
                </button>
                <button className="block text-left text-slate-400 hover:text-slate-100">
                  Careers
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-slate-300 uppercase">
                  Contact
                </p>
                <a
                  href="mailto:hello@notexonium.dev"
                  className="block text-slate-400 hover:text-slate-100"
                >
                  hello@notexonium.dev
                </a>
                <button className="block text-left text-slate-400 hover:text-slate-100">
                  Discord
                </button>
                <button className="block text-left text-slate-400 hover:text-slate-100">
                  Twitter
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} notExonium. All rights reserved.</p>
            <div className="flex gap-4">
              <button className="text-slate-400 hover:text-slate-100">
                Terms
              </button>
              <button className="text-slate-400 hover:text-slate-100">
                Privacy
              </button>
              <button className="text-slate-400 hover:text-slate-100">
                Status
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

