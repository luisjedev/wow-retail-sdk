import type {
  CharacterAchievementStatisticsResponse,
  CharacterAchievementsResponse,
  CharacterAppearanceResponse,
  CharacterCollectionsIndexResponse,
  CharacterDungeonsResponse,
  CharacterEncountersResponse,
  CharacterEquipmentResponse,
  CharacterHeirloomsCollectionResponse,
  CharacterMediaResponse,
  CharacterMountsCollectionResponse,
  CharacterParams,
  CharacterPetsCollectionResponse,
  CharacterProfileResponse,
  CharacterProfessionsResponse,
  CharacterRaidsResponse,
  CharacterStatusResponse,
  CharacterToysCollectionResponse,
} from '../types/api';

export function buildCharacterEndpoints(ctx: {
  region: string;
  request: <T>(arg: { path: string; namespace: string }) => Promise<T>;
}) {
  return {
    getCharacterProfile: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterProfileResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}`, namespace: `profile-${ctx.region}` }),
    getCharacterStatus: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterStatusResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/status`, namespace: `profile-${ctx.region}` }),
    getCharacterAppearance: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterAppearanceResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/appearance`, namespace: `profile-${ctx.region}` }),
    getCharacterMedia: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterMediaResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/character-media`, namespace: `profile-${ctx.region}` }),
    getCharacterEquipment: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterEquipmentResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/equipment`, namespace: `profile-${ctx.region}` }),
    getCharacterProfessions: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterProfessionsResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/professions`, namespace: `profile-${ctx.region}` }),
    getCharacterEncounters: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterEncountersResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/encounters`, namespace: `profile-${ctx.region}` }),
    getCharacterDungeons: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterDungeonsResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/encounters/dungeons`, namespace: `profile-${ctx.region}` }),
    getCharacterRaids: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterRaidsResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/encounters/raids`, namespace: `profile-${ctx.region}` }),
    getCharacterAchievements: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterAchievementsResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/achievements`, namespace: `profile-${ctx.region}` }),
    getCharacterAchievementStatistics: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterAchievementStatisticsResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/achievements/statistics`, namespace: `profile-${ctx.region}` }),
    getCharacterCollections: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterCollectionsIndexResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/collections`, namespace: `profile-${ctx.region}` }),
    getCharacterMountsCollection: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterMountsCollectionResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/collections/mounts`, namespace: `profile-${ctx.region}` }),
    getCharacterPetsCollection: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterPetsCollectionResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/collections/pets`, namespace: `profile-${ctx.region}` }),
    getCharacterToysCollection: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterToysCollectionResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/collections/toys`, namespace: `profile-${ctx.region}` }),
    getCharacterHeirloomsCollection: ({ realmSlug, characterName }: CharacterParams) =>
      ctx.request<CharacterHeirloomsCollectionResponse>({ path: `/profile/wow/character/${realmSlug}/${characterName}/collections/heirlooms`, namespace: `profile-${ctx.region}` }),
  };
}
