import { describe, it, expect } from 'vitest';
import { createWowClient } from '../../src';

describe('public api', () => {
  it('client exposes profile and pvp endpoint functions', () => {
    const wow = createWowClient({
      region: 'eu',
      locale: 'es_ES',
      tokenProvider: async () => 'x',
      fetchImpl: async () => ({ ok: true, json: async () => ({}) }) as never,
    });
    expect(typeof wow.getCharacterProfile).toBe('function');
    expect(typeof wow.getCharacterStatus).toBe('function');
    expect(typeof wow.getCharacterAppearance).toBe('function');
    expect(typeof wow.getCharacterMedia).toBe('function');
    expect(typeof wow.getCharacterEquipment).toBe('function');
    expect(typeof wow.getCharacterProfessions).toBe('function');
    expect(typeof wow.getCharacterEncounters).toBe('function');
    expect(typeof wow.getCharacterDungeons).toBe('function');
    expect(typeof wow.getCharacterRaids).toBe('function');
    expect(typeof wow.getCharacterAchievements).toBe('function');
    expect(typeof wow.getCharacterAchievementStatistics).toBe('function');
    expect(typeof wow.getCharacterCollections).toBe('function');
    expect(typeof wow.getCharacterMountsCollection).toBe('function');
    expect(typeof wow.getCharacterPetsCollection).toBe('function');
    expect(typeof wow.getCharacterToysCollection).toBe('function');
    expect(typeof wow.getCharacterHeirloomsCollection).toBe('function');
    expect(typeof wow.getCharacterPvpSummary).toBe('function');
    expect(typeof wow.getCharacterPvpBracket).toBe('function');
    expect(typeof wow.getPvpSeasonsIndex).toBe('function');
    expect(typeof wow.getPvpSeason).toBe('function');
    expect(typeof wow.getPvpLeaderboardsIndex).toBe('function');
    expect(typeof wow.getPvpLeaderboard).toBe('function');
    expect(typeof wow.getPvpRewardsIndex).toBe('function');
  });
});
