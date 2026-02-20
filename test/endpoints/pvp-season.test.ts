import { describe, it, expect, vi } from 'vitest';
import { createWowClient } from '../../src';

describe('pvp season endpoints', () => {
  it('uses dynamic namespace for seasons index', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 't', fetchImpl });
    await (wow as { getPvpSeasonsIndex: () => Promise<unknown> }).getPvpSeasonsIndex();
    expect(fetchImpl.mock.calls[0][0]).toContain('/data/wow/pvp-season/index');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=dynamic-eu');
  });
});
