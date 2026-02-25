import { describe, expect, it } from 'vitest';
import {
  type CharacterAchievementStatisticsResponse,
  type CharacterAchievementsResponse,
  type CharacterAppearanceResponse,
  type CharacterCollectionsIndexResponse,
  type CharacterDungeonsResponse,
  type CharacterEncountersResponse,
  type CharacterEquipmentResponse,
  type CharacterHeirloomsCollectionResponse,
  type CharacterMediaResponse,
  type CharacterMountsCollectionResponse,
  type CharacterPetsCollectionResponse,
  type CharacterProfileResponse,
  type CharacterProfessionsResponse,
  type CharacterRaidsResponse,
  type CharacterStatusResponse,
  type CharacterToysCollectionResponse,
} from '../../src';
import { createLiveWowClient, getLiveCharacter, getLiveRealm } from './helpers/live-client';

const realmSlug = getLiveRealm();
const characterName = getLiveCharacter();

describe('character live integration', () => {
  it('returns typed profile payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterProfileResponse = await wow.getCharacterProfile({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/profile/wow/character/');
    expect(typeof data.id).toBe('number');
    expect(data.name.toLowerCase()).toBe(characterName.toLowerCase());
  });

  it('returns typed status payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterStatusResponse = await wow.getCharacterStatus({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/status');
    expect(data.id).toBeGreaterThan(0);
    expect(typeof data.is_valid).toBe('boolean');
  });

  it('returns typed appearance payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterAppearanceResponse = await wow.getCharacterAppearance({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/appearance');
    expect(Array.isArray(data.customizations ?? [])).toBe(true);
  });

  it('returns typed media payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterMediaResponse = await wow.getCharacterMedia({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/character-media');
    expect(Array.isArray(data.assets ?? [])).toBe(true);
  });

  it('returns typed equipment payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterEquipmentResponse = await wow.getCharacterEquipment({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/equipment');
    expect(Array.isArray(data.equipped_items ?? [])).toBe(true);
  });

  it('returns typed professions payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterProfessionsResponse = await wow.getCharacterProfessions({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/professions');
    expect(Array.isArray(data.primaries ?? [])).toBe(true);
  });

  it('returns typed encounters payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterEncountersResponse = await wow.getCharacterEncounters({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/encounters');
    expect(Array.isArray(data.expansions ?? [])).toBe(true);
  });

  it('returns typed dungeons payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterDungeonsResponse = await wow.getCharacterDungeons({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/encounters/dungeons');
    expect(Array.isArray(data.expansions ?? [])).toBe(true);
  });

  it('returns typed raids payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterRaidsResponse = await wow.getCharacterRaids({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/encounters/raids');
    expect(Array.isArray(data.expansions ?? [])).toBe(true);
  });

  it('returns typed achievements payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterAchievementsResponse = await wow.getCharacterAchievements({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/achievements');
    expect(Array.isArray(data.achievements ?? [])).toBe(true);
  });

  it('returns typed achievement statistics payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterAchievementStatisticsResponse = await wow.getCharacterAchievementStatistics({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/achievements/statistics');
    expect(Array.isArray(data.categories ?? [])).toBe(true);
  });

  it('returns typed collections index payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterCollectionsIndexResponse = await wow.getCharacterCollections({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/collections');
    expect(typeof data._links.self.href).toBe('string');
  });

  it('returns typed mounts collection payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterMountsCollectionResponse = await wow.getCharacterMountsCollection({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/collections/mounts');
    expect(Array.isArray(data.mounts ?? [])).toBe(true);
  });

  it('returns typed pets collection payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterPetsCollectionResponse = await wow.getCharacterPetsCollection({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/collections/pets');
    expect(Array.isArray(data.unlocked_pets ?? [])).toBe(true);
  });

  it('returns typed toys collection payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterToysCollectionResponse = await wow.getCharacterToysCollection({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/collections/toys');
    expect(Array.isArray(data.toys ?? [])).toBe(true);
  });

  it('returns typed heirlooms collection payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterHeirloomsCollectionResponse = await wow.getCharacterHeirloomsCollection({ realmSlug, characterName });
    expect(data._links.self.href).toContain('/collections/heirlooms');
    expect(Array.isArray(data.heirlooms ?? [])).toBe(true);
  });
});
