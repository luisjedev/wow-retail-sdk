import { describe, it, expect, vi } from 'vitest';
import { requestJson } from '../../src/http/request';

describe('requestJson', () => {
  it('adds locale, namespace and bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    await requestJson({
      path: '/profile/wow/character/ravencrest/thrall',
      namespace: 'profile-eu',
      region: 'eu',
      locale: 'es_ES',
      tokenProvider: async () => 'abc',
      fetchImpl: fetchMock,
    });
    expect(fetchMock.mock.calls[0][0]).toContain('namespace=profile-eu');
    expect(fetchMock.mock.calls[0][0]).toContain('locale=es_ES');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toContain('Bearer abc');
  });
});
