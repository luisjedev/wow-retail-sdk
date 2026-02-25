import { describe, expect, it } from 'vitest';
import {
  type CharacterPvpBracketResponse,
  type CharacterPvpSummaryResponse,
} from '../../src';
import { createLiveWowClient, getLiveCharacter, getLiveRealm } from './helpers/live-client';

const realmSlug = getLiveRealm();
const characterName = getLiveCharacter();

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

function getBracketFromSummary(summary: CharacterPvpSummaryResponse): string | null {
  const firstBracket = summary.brackets?.[0] as Record<string, unknown> | undefined;
  if (!firstBracket) return null;

  if (typeof firstBracket.slug === 'string') return firstBracket.slug;
  if (typeof firstBracket.id === 'string') return firstBracket.id;

  const key = firstBracket.key as Record<string, unknown> | undefined;
  const keyHref = key?.href;
  if (typeof keyHref === 'string') {
    const match = keyHref.match(/\/pvp-bracket\/([^/?]+)/);
    if (match?.[1]) return match[1];
  }

  const href = firstBracket.href;
  if (typeof href === 'string') {
    const match = href.match(/\/pvp-bracket\/([^/?]+)/);
    if (match?.[1]) return match[1];
  }

  return null;
}

describe('pvp character live integration', () => {
  it('returns typed pvp summary payload', async () => {
    const wow = createLiveWowClient();
    const data: CharacterPvpSummaryResponse = await withRetry(() => wow.getCharacterPvpSummary({ realmSlug, characterName }));
    expect(data._links.self.href).toContain('/pvp-summary');
    expect(Array.isArray(data.brackets ?? [])).toBe(true);
  });

  it('returns typed pvp bracket payload', async () => {
    const wow = createLiveWowClient();
    const summary: CharacterPvpSummaryResponse = await withRetry(() => wow.getCharacterPvpSummary({ realmSlug, characterName }));
    const bracket = getBracketFromSummary(summary);

    if (!bracket) {
      expect(Array.isArray(summary.brackets ?? [])).toBe(true);
      return;
    }

    const data: CharacterPvpBracketResponse = await withRetry(() => wow.getCharacterPvpBracket({
      realmSlug,
      characterName,
      bracket,
    }));

    expect(data._links.self.href).toContain(`/pvp-bracket/${bracket}`);
    expect(data.weekly_match_statistics == null || typeof data.weekly_match_statistics === 'object').toBe(true);
  });
});
