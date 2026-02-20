export type WowRegion = 'us' | 'eu' | 'kr' | 'tw';
export type TokenProvider = () => Promise<string>;

export interface WowClientConfig {
  region: WowRegion;
  locale: string;
  tokenProvider: TokenProvider;
}
