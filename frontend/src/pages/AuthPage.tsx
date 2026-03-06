import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.16),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.35),_transparent_55%)] bg-slate-950 flex flex-col items-center justify-center px-4">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-xs text-slate-300 hover:text-slate-50"
      >
        <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-md shadow-emerald-500/40" />
        <span className="font-semibold tracking-tight">notExonium</span>
      </button>
      <div className="max-w-md w-full">
        <div className="glass-panel p-7 md:p-8">
          <div className="flex flex-col items-center gap-1 mb-6">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/40 mb-2" />
            <h1 className="text-lg font-semibold text-slate-50">
              Sign in to notExonium
            </h1>
            <p className="text-xs text-slate-400">
              Deploy your frontend projects in a few clicks.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 hover:border-slate-500 transition"
            >
              <span className="h-4 w-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                GH
              </span>
              Continue with GitHub
            </button>
            <button
              onClick={handleContinue}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900/80 border border-slate-700 px-3 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800 hover:border-slate-500 transition"
            >
              <span className="h-4 w-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                G
              </span>
              Continue with Google
            </button>
          </div>

          <p className="mt-5 text-[11px] text-slate-500 text-center">
            By continuing you agree to the{' '}
            <button className="text-slate-300 hover:text-slate-50">
              Terms
            </button>{' '}
            and{' '}
            <button className="text-slate-300 hover:text-slate-50">
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

