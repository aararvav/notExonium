type DeploymentStatus = 'queued' | 'building' | 'success' | 'failed';

const statusStyles: Record<DeploymentStatus, string> = {
  queued: 'badge-muted',
  building: 'badge-muted',
  success: 'badge-success',
  failed: 'badge-danger',
};

const statusLabel: Record<DeploymentStatus, string> = {
  queued: 'Queued',
  building: 'Building',
  success: 'Success',
  failed: 'Failed',
};

interface Props {
  status: DeploymentStatus;
}

export function DeploymentStatusBadge({ status }: Props) {
  return <span className={statusStyles[status]}>{statusLabel[status]}</span>;
}

