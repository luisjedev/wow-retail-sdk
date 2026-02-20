import { describe, it, expect, vi } from 'vitest';
import { createWowClient } from '../../src';

describe('pvp character endpoints', () => {
  it('calls pvp summary endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 't', fetchImpl });
    await (wow as { getCharacterPvpSummary: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterPvpSummary({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/pvp-summary');
  });
});
