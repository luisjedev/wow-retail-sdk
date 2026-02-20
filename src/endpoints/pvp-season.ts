export function buildPvpSeasonEndpoints(ctx: {
  region: string;
  request: (arg: { path: string; namespace: string }) => Promise<unknown>;
}) {
  return {
    getPvpSeasonsIndex: () => ctx.request({ path: '/data/wow/pvp-season/index', namespace: `dynamic-${ctx.region}` }),
    getPvpSeason: ({ seasonId }: { seasonId: number }) =>
      ctx.request({ path: `/data/wow/pvp-season/${seasonId}`, namespace: `dynamic-${ctx.region}` }),
    getPvpLeaderboardsIndex: ({ seasonId }: { seasonId: number }) =>
      ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/index`, namespace: `dynamic-${ctx.region}` }),
    getPvpLeaderboard: ({ seasonId, bracket }: { seasonId: number; bracket: string }) =>
      ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/${bracket}`, namespace: `dynamic-${ctx.region}` }),
    getPvpRewardsIndex: ({ seasonId }: { seasonId: number }) =>
      ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-reward/index`, namespace: `dynamic-${ctx.region}` }),
  };
}
