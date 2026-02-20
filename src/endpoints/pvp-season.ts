import type {
  PvpLeaderboardParams,
  PvpLeaderboardsIndexResponse,
  PvpLeaderboardResponse,
  PvpRewardsIndexResponse,
  PvpSeasonParams,
  PvpSeasonResponse,
  PvpSeasonsIndexResponse,
} from '../types/api';

export function buildPvpSeasonEndpoints(ctx: {
  region: string;
  request: <T>(arg: { path: string; namespace: string }) => Promise<T>;
}) {
  return {
    getPvpSeasonsIndex: () => ctx.request<PvpSeasonsIndexResponse>({ path: '/data/wow/pvp-season/index', namespace: `dynamic-${ctx.region}` }),
    getPvpSeason: ({ seasonId }: PvpSeasonParams) =>
      ctx.request<PvpSeasonResponse>({ path: `/data/wow/pvp-season/${seasonId}`, namespace: `dynamic-${ctx.region}` }),
    getPvpLeaderboardsIndex: ({ seasonId }: PvpSeasonParams) =>
      ctx.request<PvpLeaderboardsIndexResponse>({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/index`, namespace: `dynamic-${ctx.region}` }),
    getPvpLeaderboard: ({ seasonId, bracket }: PvpLeaderboardParams) =>
      ctx.request<PvpLeaderboardResponse>({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/${bracket}`, namespace: `dynamic-${ctx.region}` }),
    getPvpRewardsIndex: ({ seasonId }: PvpSeasonParams) =>
      ctx.request<PvpRewardsIndexResponse>({ path: `/data/wow/pvp-season/${seasonId}/pvp-reward/index`, namespace: `dynamic-${ctx.region}` }),
  };
}
