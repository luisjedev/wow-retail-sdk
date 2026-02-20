export function buildPvpCharacterEndpoints(ctx: {
  region: string;
  request: (arg: { path: string; namespace: string }) => Promise<unknown>;
}) {
  return {
    getCharacterPvpSummary: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-summary`, namespace: `profile-${ctx.region}` }),
    getCharacterPvpBracket: ({ realmSlug, characterName, bracket }: { realmSlug: string; characterName: string; bracket: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-bracket/${bracket}`, namespace: `profile-${ctx.region}` }),
  };
}
