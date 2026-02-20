export function buildApiUrl(region: string, path: string, namespace: string, locale: string) {
  return `https://${region}.api.blizzard.com${path}?namespace=${namespace}&locale=${locale}`;
}
