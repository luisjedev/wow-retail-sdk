export type WowRegion = 'us' | 'eu' | 'kr' | 'tw';
export type TokenProvider = () => Promise<string>;

export interface WowClientConfig {
  region: WowRegion;
  locale: string;
  tokenProvider: TokenProvider;
  fetchImpl?: (input: string, init?: { headers?: Record<string, string> }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;
}
