export function buildCharacterEndpoints(ctx: {
  region: string;
  request: (arg: { path: string; namespace: string }) => Promise<unknown>;
}) {
  return {
    getCharacterProfile: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}`, namespace: `profile-${ctx.region}` }),
    getCharacterStatus: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/status`, namespace: `profile-${ctx.region}` }),
  };
}
