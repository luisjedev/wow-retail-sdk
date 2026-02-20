import { describe, it, expect, vi } from 'vitest';
import { createWowClient } from '../../src';

describe('character endpoints', () => {
  it('calls profile endpoint with profile namespace', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 't', fetchImpl } as never);
    await (wow as { getCharacterProfile: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterProfile({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });
});
