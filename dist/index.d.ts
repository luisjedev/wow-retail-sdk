type WowRegion = 'us' | 'eu' | 'kr' | 'tw';
type TokenProvider = () => Promise<string>;
interface WowClientConfig {
    region: WowRegion;
    locale: string;
    tokenProvider: TokenProvider;
    fetchImpl?: (input: string, init?: {
        headers?: Record<string, string>;
    }) => Promise<{
        ok: boolean;
        json: () => Promise<unknown>;
    }>;
}

declare function createWowClient(config: WowClientConfig): {
    getPvpSeasonsIndex: () => Promise<unknown>;
    getPvpSeason: ({ seasonId }: {
        seasonId: number;
    }) => Promise<unknown>;
    getPvpLeaderboardsIndex: ({ seasonId }: {
        seasonId: number;
    }) => Promise<unknown>;
    getPvpLeaderboard: ({ seasonId, bracket }: {
        seasonId: number;
        bracket: string;
    }) => Promise<unknown>;
    getPvpRewardsIndex: ({ seasonId }: {
        seasonId: number;
    }) => Promise<unknown>;
    getCharacterPvpSummary: ({ realmSlug, characterName }: {
        realmSlug: string;
        characterName: string;
    }) => Promise<unknown>;
    getCharacterPvpBracket: ({ realmSlug, characterName, bracket }: {
        realmSlug: string;
        characterName: string;
        bracket: string;
    }) => Promise<unknown>;
    getCharacterProfile: ({ realmSlug, characterName }: {
        realmSlug: string;
        characterName: string;
    }) => Promise<unknown>;
    getCharacterStatus: ({ realmSlug, characterName }: {
        realmSlug: string;
        characterName: string;
    }) => Promise<unknown>;
};

declare class WowApiError extends Error {
    meta: {
        status: number;
        path: string;
    };
    constructor(message: string, meta: {
        status: number;
        path: string;
    });
    get status(): number;
}
declare class WowNotFoundError extends WowApiError {
}
declare class WowAuthError extends WowApiError {
}
declare class WowRateLimitError extends WowApiError {
}
declare class WowValidationError extends Error {
}

export { type TokenProvider, WowApiError, WowAuthError, type WowClientConfig, WowNotFoundError, WowRateLimitError, type WowRegion, WowValidationError, createWowClient };
