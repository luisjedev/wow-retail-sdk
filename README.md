# wow-sdk

A framework-agnostic TypeScript SDK for consuming the public World of Warcraft (Blizzard) API with one function per endpoint.

## Current status

Current coverage includes:

- Character Profile (no account-scoped)
- Character PvP
- PvP Seasons (game data)

## Requirements

- Node.js 20+
- Blizzard Developer Portal credentials (`client_id`, `client_secret`)
- A backend/serverless/edge environment to obtain Blizzard access tokens

## Security (important)

Do not expose `client_secret` in frontend code.
Do not expose Blizzard client_secret in frontend code.

This SDK is designed to receive a `tokenProvider` that returns a bearer token generated in a secure environment. If you use React/Vite/Next on the client side, call your backend to fetch or proxy data; never ship secrets in client bundles.

## Installation

While the package is not published yet, use it locally in this repository.

```bash
npm install
```

## Quick start

```ts
import { createWowClient } from 'wow-sdk';

const wow = createWowClient({
  region: 'eu',
  locale: 'es_ES',
  tokenProvider: async () => getTokenFromMyBackend(),
});

const profile = await wow.getCharacterProfile({
  realmSlug: 'ravencrest',
  characterName: 'thrall',
});
```

## Client configuration

`createWowClient(config)` accepts:

- `region`: `'us' | 'eu' | 'kr' | 'tw'`
- `locale`: for example `'es_ES'`, `'en_US'`
- `tokenProvider`: `() => Promise<string>`
- `fetchImpl` (optional): custom `fetch` implementation for tests or specific runtimes

`tokenProvider` example with in-memory caching:

```ts
let cachedToken: string | null = null;
let expiresAt = 0;

async function tokenProvider() {
  if (cachedToken && Date.now() < expiresAt) return cachedToken;

  const response = await fetch('https://mi-backend.com/blizzard/token');
  const data = await response.json();

  cachedToken = data.access_token;
  expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}
```

## Available API

### Character Profile (namespace `profile-{region}`)

- `getCharacterProfile({ realmSlug, characterName })`
- `getCharacterStatus({ realmSlug, characterName })`
- `getCharacterAppearance({ realmSlug, characterName })`
- `getCharacterMedia({ realmSlug, characterName })`
- `getCharacterEquipment({ realmSlug, characterName })`
- `getCharacterProfessions({ realmSlug, characterName })`
- `getCharacterEncounters({ realmSlug, characterName })`
- `getCharacterDungeons({ realmSlug, characterName })`
- `getCharacterRaids({ realmSlug, characterName })`
- `getCharacterAchievements({ realmSlug, characterName })`
- `getCharacterAchievementStatistics({ realmSlug, characterName })`
- `getCharacterCollections({ realmSlug, characterName })`
- `getCharacterMountsCollection({ realmSlug, characterName })`
- `getCharacterPetsCollection({ realmSlug, characterName })`
- `getCharacterToysCollection({ realmSlug, characterName })`
- `getCharacterHeirloomsCollection({ realmSlug, characterName })`

### Character PvP (namespace `profile-{region}`)

- `getCharacterPvpSummary({ realmSlug, characterName })`
- `getCharacterPvpBracket({ realmSlug, characterName, bracket })`

### PvP Seasons (namespace `dynamic-{region}`)

- `getPvpSeasonsIndex()`
- `getPvpSeason({ seasonId })`
- `getPvpLeaderboardsIndex({ seasonId })`
- `getPvpLeaderboard({ seasonId, bracket })`
- `getPvpRewardsIndex({ seasonId })`

## Error handling

The SDK exports typed errors from `src/errors.ts`:

- `WowApiError`
- `WowAuthError`
- `WowNotFoundError`
- `WowRateLimitError`
- `WowValidationError`

Example:

```ts
import { WowNotFoundError } from 'wow-sdk';

try {
  await wow.getCharacterProfile({ realmSlug: 'ravencrest', characterName: 'unknown' });
} catch (error) {
  if (error instanceof WowNotFoundError) {
    console.log('Character not found');
  }
}
```

## Development

```bash
npm run test
npm run build
```
