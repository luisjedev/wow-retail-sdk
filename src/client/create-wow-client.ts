import type { WowClientConfig } from '../types/config';

export function createWowClient(config: WowClientConfig) {
  if (!config?.tokenProvider) throw new Error('tokenProvider is required');
  return {};
}
