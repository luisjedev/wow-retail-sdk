import { buildApiUrl } from './url';

interface RequestJsonOptions {
  path: string;
  namespace: string;
  region: string;
  locale: string;
  tokenProvider: () => Promise<string>;
  fetchImpl: (input: string, init?: { headers?: Record<string, string> }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;
}

export async function requestJson<T>(opts: RequestJsonOptions): Promise<T> {
  const token = await opts.tokenProvider();
  const url = buildApiUrl(opts.region, opts.path, opts.namespace, opts.locale);
  const response = await opts.fetchImpl(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('request failed');
  return response.json() as Promise<T>;
}
