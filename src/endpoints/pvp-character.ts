import type { CharacterParams, CharacterPvpBracketParams, CharacterPvpBracketResponse, CharacterPvpSummaryResponse } from '../types/api';

export function buildPvpCharacterEndpoints(ctx: {
  region: string;
  request: <T>(arg: { path: string; namespace: string }) => Promise<T>;
}) {
  return {
    getCharacterPvpSummary: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterPvpSummaryResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-summary`, namespace: `profile-${ctx.region}` }),
    getCharacterPvpBracket: ({ realmSlug, characterName, bracket }: CharacterPvpBracketParams) =>
      ctx.request<CharacterPvpBracketResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-bracket/${bracket}`, namespace: `profile-${ctx.region}` }),
  };
}
