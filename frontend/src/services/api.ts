const API_BASE_URL = 'http://localhost:9000';

interface DeployPayload {
  repoUrl: string;
  slug?: string;
}

interface DeployResponse {
  slug?: string;
  [key: string]: unknown;
}

export async function deployProject(payload: DeployPayload): Promise<DeployResponse> {
  const response = await fetch(`${API_BASE_URL}/project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to deploy project');
  }

  return (await response.json()) as DeployResponse;
}

