import { DeploymentStatusBadge } from '../../components/ui/DeploymentStatusBadge';
import { LiveDeploymentTimeline } from '../../components/ui/LiveDeploymentTimeline';
import { Link } from 'react-router-dom';

const MOCK_DEPLOYMENTS = [
  {
    id: '1',
    projectName: 'marketing-site',
    status: 'success' as const,
    url: 'http://marketing-site.localhost:8000',
    createdAt: '2 min ago',
  },
  {
    id: '2',
    projectName: 'docs',
    status: 'building' as const,
    url: 'http://docs.localhost:8000',
    createdAt: '40 sec ago',
  },
  {
    id: '3',
    projectName: 'dashboard',
    status: 'failed' as const,
    url: 'http://dashboard.localhost:8000',
    createdAt: '13 min ago',
  },
];

export function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-50">
            Deployments
          </h1>
          <p className="text-xs text-slate-400">
            All of your recent static deployments across projects.
          </p>
        </div>
        <Link to="/app/deploy" className="btn-primary text-xs md:text-sm">
          Deploy new project
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="glass-panel overflow-hidden">
          <div className="border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Recent deployments
            </p>
            <p className="text-[11px] text-slate-500">
              {MOCK_DEPLOYMENTS.length} total
            </p>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-800/80 text-slate-400">
                <tr>
                  <th className="px-4 py-2 font-medium">Project Name</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">URL</th>
                  <th className="px-4 py-2 font-medium">Created Time</th>
                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {MOCK_DEPLOYMENTS.map((deployment) => (
                  <tr
                    key={deployment.id}
                    className="hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-100">
                          {deployment.projectName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          main • #{deployment.id.padStart(4, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <DeploymentStatusBadge status={deployment.status} />
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-emerald-300">
                      {deployment.url}
                    </td>
                    <td className="px-4 py-2.5 text-slate-300">
                      {deployment.createdAt}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-2">
                        <a
                          href={deployment.url}
                          className="btn-outline text-[11px] px-3 py-1.5"
                        >
                          Open site
                        </a>
                        <Link
                          to={`/app/logs/${deployment.projectName}`}
                          className="btn-outline text-[11px] px-3 py-1.5"
                        >
                          View logs
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <LiveDeploymentTimeline currentStep={2} />
      </div>
    </div>
  );
}

