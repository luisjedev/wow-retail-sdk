// src/http/url.ts
function buildApiUrl(region, path, namespace, locale) {
  return `https://${region}.api.blizzard.com${path}?namespace=${namespace}&locale=${locale}`;
}

// src/http/request.ts
async function requestJson(opts) {
  const token = await opts.tokenProvider();
  const url = buildApiUrl(opts.region, opts.path, opts.namespace, opts.locale);
  const response = await opts.fetchImpl(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("request failed");
  return response.json();
}

// src/endpoints/character.ts
function buildCharacterEndpoints(ctx) {
  return {
    getCharacterProfile: ({ realmSlug, characterName }) => ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}`, namespace: `profile-${ctx.region}` }),
    getCharacterStatus: ({ realmSlug, characterName }) => ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/status`, namespace: `profile-${ctx.region}` })
  };
}

// src/endpoints/pvp-character.ts
function buildPvpCharacterEndpoints(ctx) {
  return {
    getCharacterPvpSummary: ({ realmSlug, characterName }) => ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-summary`, namespace: `profile-${ctx.region}` }),
    getCharacterPvpBracket: ({ realmSlug, characterName, bracket }) => ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-bracket/${bracket}`, namespace: `profile-${ctx.region}` })
  };
}

// src/endpoints/pvp-season.ts
function buildPvpSeasonEndpoints(ctx) {
  return {
    getPvpSeasonsIndex: () => ctx.request({ path: "/data/wow/pvp-season/index", namespace: `dynamic-${ctx.region}` }),
    getPvpSeason: ({ seasonId }) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}`, namespace: `dynamic-${ctx.region}` }),
    getPvpLeaderboardsIndex: ({ seasonId }) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/index`, namespace: `dynamic-${ctx.region}` }),
    getPvpLeaderboard: ({ seasonId, bracket }) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/${bracket}`, namespace: `dynamic-${ctx.region}` }),
    getPvpRewardsIndex: ({ seasonId }) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-reward/index`, namespace: `dynamic-${ctx.region}` })
  };
}

// src/client/create-wow-client.ts
function createWowClient(config) {
  if (!config?.tokenProvider) throw new Error("tokenProvider is required");
  const fetchImpl = config.fetchImpl ?? globalThis.fetch;
  const request = ({ path, namespace }) => requestJson({
    path,
    namespace,
    region: config.region,
    locale: config.locale,
    tokenProvider: config.tokenProvider,
    fetchImpl
  });
  return {
    ...buildCharacterEndpoints({ region: config.region, request }),
    ...buildPvpCharacterEndpoints({ region: config.region, request }),
    ...buildPvpSeasonEndpoints({ region: config.region, request })
  };
}

// src/errors.ts
var WowApiError = class extends Error {
  constructor(message, meta) {
    super(message);
    this.meta = meta;
  }
  get status() {
    return this.meta.status;
  }
};
var WowNotFoundError = class extends WowApiError {
};
var WowAuthError = class extends WowApiError {
};
var WowRateLimitError = class extends WowApiError {
};
var WowValidationError = class extends Error {
};
export {
  WowApiError,
  WowAuthError,
  WowNotFoundError,
  WowRateLimitError,
  WowValidationError,
  createWowClient
};
