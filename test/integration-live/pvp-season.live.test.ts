import { describe, expect, it } from 'vitest';
import {
  type PvpLeaderboardsIndexResponse,
  type PvpLeaderboardResponse,
  type PvpRewardsIndexResponse,
  type PvpSeasonResponse,
  type PvpSeasonsIndexResponse,
} from '../../src';
import { createLiveWowClient } from './helpers/live-client';

async function withRetry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) break;
      await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    }
  }
  throw lastError;
}

function getBracketFromLeaderboardRef(leaderboardRef: Record<string, unknown> | undefined): string | null {
  if (!leaderboardRef) return null;
  if (typeof leaderboardRef.slug === 'string') return leaderboardRef.slug;
  if (typeof leaderboardRef.id === 'string') return leaderboardRef.id;

  const key = leaderboardRef.key as Record<string, unknown> | undefined;
  const keyHref = key?.href;
  if (typeof keyHref === 'string') {
    const match = keyHref.match(/\/pvp-leaderboard\/([^/?]+)/);
    if (match?.[1]) return match[1];
  }

  const href = leaderboardRef.href;
  if (typeof href === 'string') {
    const match = href.match(/\/pvp-leaderboard\/([^/?]+)/);
    if (match?.[1]) return match[1];
  }

  return null;
}

describe('pvp season live integration', () => {
  it('returns typed seasons index payload', async () => {
    const wow = createLiveWowClient();
    const data: PvpSeasonsIndexResponse = await withRetry(() => wow.getPvpSeasonsIndex());
    expect(data._links.self.href).toContain('/data/wow/pvp-season/');
    expect(Array.isArray(data.seasons ?? [])).toBe(true);
    expect((data.seasons ?? []).length).toBeGreaterThan(0);
  });

  it('returns typed season payload chain', async () => {
    const wow = createLiveWowClient();
    const index: PvpSeasonsIndexResponse = await withRetry(() => wow.getPvpSeasonsIndex());
    const seasonIds = (index.seasons ?? [])
      .map((season) => season.id)
      .filter((seasonId): seasonId is number => typeof seasonId === 'number');

    expect(seasonIds.length).toBeGreaterThan(0);

    let seasonId: number | null = null;
    let season: PvpSeasonResponse | null = null;
    let leaderboards: PvpLeaderboardsIndexResponse | null = null;

    for (const candidateSeasonId of seasonIds) {
      try {
        const candidateSeason = await withRetry(() => wow.getPvpSeason({ seasonId: candidateSeasonId }));
        const candidateLeaderboards = await withRetry(() => wow.getPvpLeaderboardsIndex({ seasonId: candidateSeasonId }));
        if ((candidateLeaderboards.leaderboards ?? []).length > 0) {
          seasonId = candidateSeasonId;
          season = candidateSeason;
          leaderboards = candidateLeaderboards;
          break;
        }
      } catch {
      }
    }

    expect(seasonId).not.toBeNull();
    expect(season).not.toBeNull();
    expect(leaderboards).not.toBeNull();

    const resolvedSeasonId = seasonId as number;
    const resolvedSeason = season as PvpSeasonResponse;
    const resolvedLeaderboards = leaderboards as PvpLeaderboardsIndexResponse;

    expect(resolvedSeason._links.self.href).toContain(`/data/wow/pvp-season/${resolvedSeasonId}`);
    expect(resolvedSeason.id).toBe(resolvedSeasonId);

    expect(resolvedLeaderboards._links.self.href).toContain(`/data/wow/pvp-season/${resolvedSeasonId}/pvp-leaderboard/`);
    expect(Array.isArray(resolvedLeaderboards.leaderboards ?? [])).toBe(true);

    const bracket = getBracketFromLeaderboardRef(resolvedLeaderboards.leaderboards?.[0] as Record<string, unknown> | undefined) ?? '3v3';

    const leaderboard: PvpLeaderboardResponse = await withRetry(() => wow.getPvpLeaderboard({
      seasonId: resolvedSeasonId,
      bracket,
    }));
    expect(leaderboard._links.self.href).toContain(`/data/wow/pvp-season/${resolvedSeasonId}/pvp-leaderboard/`);
    expect(Array.isArray(leaderboard.entries ?? [])).toBe(true);

    const rewards: PvpRewardsIndexResponse = await withRetry(() => wow.getPvpRewardsIndex({ seasonId: resolvedSeasonId }));
    expect(rewards._links.self.href).toContain(`/data/wow/pvp-season/${resolvedSeasonId}/pvp-reward/`);
    expect(Array.isArray(rewards.rewards ?? [])).toBe(true);
  }, 30000);
});
