export function buildCharacterEndpoints(ctx: {
  region: string;
  request: (arg: { path: string; namespace: string }) => Promise<unknown>;
}) {
  return {
    getCharacterProfile: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}`, namespace: `profile-${ctx.region}` }),
    getCharacterStatus: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/status`, namespace: `profile-${ctx.region}` }),
    getCharacterAppearance: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/appearance`, namespace: `profile-${ctx.region}` }),
    getCharacterMedia: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/character-media`, namespace: `profile-${ctx.region}` }),
    getCharacterEquipment: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/equipment`, namespace: `profile-${ctx.region}` }),
    getCharacterProfessions: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/professions`, namespace: `profile-${ctx.region}` }),
    getCharacterEncounters: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/encounters`, namespace: `profile-${ctx.region}` }),
    getCharacterDungeons: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/encounters/dungeons`, namespace: `profile-${ctx.region}` }),
    getCharacterRaids: ({ realmSlug, characterName }: { realmSlug: string; characterName: string }) =>
      ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/encounters/raids`, namespace: `profile-${ctx.region}` }),
  };
}
