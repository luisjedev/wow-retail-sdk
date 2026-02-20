import { describe, it, expect, vi } from 'vitest';
import { createWowClient } from '../../src';

describe('character endpoints', () => {
  const setup = () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 't', fetchImpl } as never);
    return { wow, fetchImpl };
  };

  it('calls profile endpoint with profile namespace', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterProfile: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterProfile({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character appearance endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterAppearance: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterAppearance({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/appearance');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character media endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterMedia: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterMedia({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/character-media');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character equipment endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterEquipment: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterEquipment({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/equipment');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character professions endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterProfessions: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterProfessions({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/professions');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character encounters endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterEncounters: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterEncounters({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/encounters');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character dungeons endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterDungeons: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterDungeons({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/encounters/dungeons');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character raids endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterRaids: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterRaids({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/encounters/raids');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character achievements endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterAchievements: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterAchievements({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/achievements');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character achievement statistics endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterAchievementStatistics: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterAchievementStatistics({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/achievements/statistics');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character collections endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterCollections: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterCollections({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/collections');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character mounts collection endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterMountsCollection: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterMountsCollection({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/collections/mounts');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character pets collection endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterPetsCollection: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterPetsCollection({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/collections/pets');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character toys collection endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterToysCollection: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterToysCollection({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/collections/toys');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });

  it('calls character heirlooms collection endpoint', async () => {
    const { wow, fetchImpl } = setup();
    await (wow as { getCharacterHeirloomsCollection: (arg: { realmSlug: string; characterName: string }) => Promise<unknown> }).getCharacterHeirloomsCollection({ realmSlug: 'ravencrest', characterName: 'thrall' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall/collections/heirlooms');
    expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
  });
});
