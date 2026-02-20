export interface WowSelfLink {
  href: string;
}

export interface WowLinks {
  self: WowSelfLink;
}

export interface WowResourceRef {
  key?: WowSelfLink;
  id?: number;
  name?: string;
  slug?: string;
}

export interface CharacterParams {
  realmSlug: string;
  characterName: string;
}

export interface CharacterPvpBracketParams extends CharacterParams {
  bracket: string;
}

export interface PvpSeasonParams {
  seasonId: number;
}

export interface PvpLeaderboardParams extends PvpSeasonParams {
  bracket: string;
}

export interface CharacterProfileResponse {
  _links: WowLinks;
  id: number;
  name: string;
  gender?: WowResourceRef;
  faction?: WowResourceRef;
  race?: WowResourceRef;
  character_class?: WowResourceRef;
  active_spec?: WowResourceRef;
  realm?: WowResourceRef;
  guild?: WowResourceRef;
  level: number;
  experience?: number;
  achievement_points?: number;
  achievements?: WowSelfLink;
  titles?: WowSelfLink;
  pvp_summary?: WowSelfLink;
  encounters?: WowSelfLink;
  media?: WowSelfLink;
  specializations?: WowSelfLink;
  statistics?: WowSelfLink;
  mythic_keystone_profile?: WowSelfLink;
  equipment?: WowSelfLink;
  appearance?: WowSelfLink;
  collections?: WowSelfLink;
  professions?: WowSelfLink;
  last_login_timestamp?: number;
  average_item_level?: number;
  equipped_item_level?: number;
  covenant_progress?: WowSelfLink;
}

export interface CharacterStatusResponse {
  _links: WowLinks;
  id: number;
  is_valid: boolean;
}

export interface CharacterAppearanceResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  playable_race?: WowResourceRef;
  playable_class?: WowResourceRef;
  active_spec?: WowResourceRef;
  gender?: WowResourceRef;
  faction?: WowResourceRef;
  guild_crest?: WowResourceRef;
  items?: Array<Record<string, unknown>>;
  customizations?: Array<Record<string, unknown>>;
}

export interface CharacterMediaResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  assets?: Array<{
    key?: string;
    value?: string;
    file_data_id?: number;
  }>;
}

export interface CharacterEquipmentResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  equipped_items?: Array<Record<string, unknown>>;
  equipped_item_sets?: Array<Record<string, unknown>>;
}

export interface CharacterProfessionsResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  primaries?: Array<Record<string, unknown>>;
  secondaries?: Array<Record<string, unknown>>;
}

export interface CharacterEncountersResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  expansions?: Array<Record<string, unknown>>;
}

export interface CharacterDungeonsResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  expansions?: Array<Record<string, unknown>>;
}

export interface CharacterRaidsResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  expansions?: Array<Record<string, unknown>>;
}

export interface CharacterAchievementsResponse {
  _links: WowLinks;
  total_quantity?: number;
  total_points?: number;
  achievements?: Array<Record<string, unknown>>;
  category_progress?: Array<Record<string, unknown>>;
  recent_events?: Array<Record<string, unknown>>;
}

export interface CharacterAchievementStatisticsResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  categories?: Array<Record<string, unknown>>;
}

export interface CharacterCollectionsIndexResponse {
  _links: WowLinks;
  mounts?: WowSelfLink;
  pets?: WowSelfLink;
  toys?: WowSelfLink;
  heirlooms?: WowSelfLink;
}

export interface CharacterMountsCollectionResponse {
  _links: WowLinks;
  mounts?: Array<Record<string, unknown>>;
}

export interface CharacterPetsCollectionResponse {
  _links: WowLinks;
  unlocked_pets?: Array<Record<string, unknown>>;
}

export interface CharacterToysCollectionResponse {
  _links: WowLinks;
  toys?: Array<Record<string, unknown>>;
}

export interface CharacterHeirloomsCollectionResponse {
  _links: WowLinks;
  heirlooms?: Array<Record<string, unknown>>;
}

export interface CharacterPvpSummaryResponse {
  _links: WowLinks;
  honorable_kills?: number;
  pvp_map_statistics?: Array<Record<string, unknown>>;
  brackets?: Array<Record<string, unknown>>;
}

export interface CharacterPvpBracketResponse {
  _links: WowLinks;
  character?: WowResourceRef;
  faction?: WowResourceRef;
  bracket?: WowResourceRef;
  season?: WowResourceRef;
  weekly_match_statistics?: Record<string, unknown>;
  season_match_statistics?: Record<string, unknown>;
}

export interface PvpSeasonsIndexResponse {
  _links: WowLinks;
  seasons?: Array<WowResourceRef>;
}

export interface PvpSeasonResponse {
  _links: WowLinks;
  id: number;
  season_start_timestamp?: number;
  season_end_timestamp?: number;
  pvp_region?: WowResourceRef;
  leaderboards?: WowSelfLink;
  rewards?: WowSelfLink;
}

export interface PvpLeaderboardsIndexResponse {
  _links: WowLinks;
  season?: WowResourceRef;
  leaderboards?: Array<WowResourceRef>;
}

export interface PvpLeaderboardResponse {
  _links: WowLinks;
  season?: WowResourceRef;
  name?: string;
  bracket?: WowResourceRef;
  entries?: Array<Record<string, unknown>>;
}

export interface PvpRewardsIndexResponse {
  _links: WowLinks;
  season?: WowResourceRef;
  rewards?: Array<Record<string, unknown>>;
}
