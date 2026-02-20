import { describe, it, expect } from 'vitest';
import { createWowClient } from '../../src';

describe('public api', () => {
  it('client exposes nine MVP endpoint functions', () => {
    const wow = createWowClient({
      region: 'eu',
      locale: 'es_ES',
      tokenProvider: async () => 'x',
      fetchImpl: async () => ({ ok: true, json: async () => ({}) }) as never,
    });
    expect(typeof wow.getCharacterProfile).toBe('function');
    expect(typeof wow.getCharacterStatus).toBe('function');
    expect(typeof wow.getCharacterPvpSummary).toBe('function');
    expect(typeof wow.getCharacterPvpBracket).toBe('function');
    expect(typeof wow.getPvpSeasonsIndex).toBe('function');
    expect(typeof wow.getPvpSeason).toBe('function');
    expect(typeof wow.getPvpLeaderboardsIndex).toBe('function');
    expect(typeof wow.getPvpLeaderboard).toBe('function');
    expect(typeof wow.getPvpRewardsIndex).toBe('function');
  });
});
