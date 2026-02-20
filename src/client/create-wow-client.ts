import type { WowClientConfig } from '../types/config';
import { requestJson } from '../http/request';
import { buildCharacterEndpoints } from '../endpoints/character';
import { buildPvpCharacterEndpoints } from '../endpoints/pvp-character';
import { buildPvpSeasonEndpoints } from '../endpoints/pvp-season';

export function createWowClient(config: WowClientConfig) {
  if (!config?.tokenProvider) throw new Error('tokenProvider is required');

  const fetchImpl =
    config.fetchImpl ??
    ((globalThis.fetch as unknown) as (input: string, init?: { headers?: Record<string, string> }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>);

  const request = <T>({ path, namespace }: { path: string; namespace: string }) =>
    requestJson<T>({
      path,
      namespace,
      region: config.region,
      locale: config.locale,
      tokenProvider: config.tokenProvider,
      fetchImpl,
    });

  return {
    ...buildCharacterEndpoints({ region: config.region, request }),
    ...buildPvpCharacterEndpoints({ region: config.region, request }),
    ...buildPvpSeasonEndpoints({ region: config.region, request }),
  };
}
