# wow-retail-sdk

A framework-agnostic TypeScript SDK for consuming the public World of Warcraft (Blizzard) API with one function per endpoint.

Playground example app (Next.js + Server Actions):

- https://github.com/luisjedev/wow-retail-playground

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

```bash
npm i wow-retail-sdk
# or
pnpm add wow-retail-sdk
# or
yarn add wow-retail-sdk
```

## Real flow (playground)

Flow requested (playground architecture):

1. `wow-client`
2. `getBlizzardAccessToken`
3. `getCharacterProfile-call`
4. `getCharacterProfile-action`

Reference implementation:

- https://github.com/luisjedev/wow-retail-playground

### 1) `wow-client` (`lib/wow-client.ts`)

Shared server-side client with secure token provider:

```ts
import { cache } from "react";
import { createWowClient } from "wow-retail-sdk";
import { getBlizzardAccessToken } from "@/lib/blizzard";
import { getServerEnv } from "@/lib/env";

export const getWowClient = cache(() => {
  const env = getServerEnv();

  return createWowClient({
    region: env.wowRegion,
    locale: env.wowLocale,
    tokenProvider: async () => {
      const tokenData = await getBlizzardAccessToken();
      return tokenData.access_token;
    },
  });
});
```

### 2) `getBlizzardAccessToken` (`lib/blizzard.ts`)

The token function is used by `tokenProvider` and stays server-side.

```ts
import { getServerEnv } from "@/lib/env";
import type { WowRegion } from "wow-retail-sdk";

type BlizzardTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
};

function getOauthUrl(region: WowRegion): string {
  return "https://oauth.battle.net/token";
}

export async function getBlizzardAccessToken(): Promise<BlizzardTokenResponse> {
  const env = getServerEnv();
  const oauthUrl = getOauthUrl(env.wowRegion);
  const credentials = Buffer.from(`${env.blizzardClientId}:${env.blizzardClientSecret}`).toString("base64");

  const response = await fetch(oauthUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Token request failed: ${response.status} ${responseText}`);
  }

  return (await response.json()) as BlizzardTokenResponse;
}
```

### 3) `getCharacterProfile-call` (`components/calls/getCharacterProfile-call.tsx`)

UI block that triggers the server action:

```tsx
"use client";

import { useActionState } from "react";
import { getCharacterProfileAction } from "@/app/actions/calls/getCharacterProfile-action";

export function GetCharacterProfileCall() {
  const [state, formAction, isPending] = useActionState(getCharacterProfileAction, {
    responseText: "",
    data: null,
    error: null,
  });

  return (
    <form action={formAction}>
      <input type="text" name="realmSlug" defaultValue="zuljin" />
      <input type="text" name="characterName" defaultValue="ragekun" />
      <button type="submit" disabled={isPending}>{isPending ? "Running..." : "Run"}</button>

      {state.data ? (
        <div>
          <p>Name: {state.data.name}</p>
          <p>Level: {state.data.level}</p>
          <p>Realm: {state.data.realm?.name ?? "Unknown"}</p>
        </div>
      ) : null}

      <textarea value={state.responseText} readOnly rows={20} />
    </form>
  );
}
```

### 4) `getCharacterProfile-action` (`app/actions/calls/getCharacterProfile-action.ts`)

Server action that executes the SDK call:

```ts
"use server";

import type { CharacterProfileResponse } from "wow-retail-sdk";
import { getWowClient } from "@/lib/wow-client";

export type GetCharacterProfileActionState = {
  responseText: string;
  data: CharacterProfileResponse | null;
  error: string | null;
};

export async function getCharacterProfileAction(
  _: GetCharacterProfileActionState,
  formData: FormData,
): Promise<GetCharacterProfileActionState> {
  try {
    // parse/normalize formData values...
    const realmSlug = "zuljin";
    const characterName = "ragekun";

    const wowClient = getWowClient();
    const data = await wowClient.getCharacterProfile({ realmSlug, characterName });

    return {
      responseText: JSON.stringify(data, null, 2),
      data,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return {
      responseText: JSON.stringify({ error: message }, null, 2),
      data: null,
      error: message,
    };
  }
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
import { WowNotFoundError } from 'wow-retail-sdk';

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
npm run test:live
npm run test:all
npm run build
```

### Live integration tests

Live integration tests call Blizzard APIs with real credentials.

Required environment variables:

- `BLIZZARD_CLIENT_ID`
- `BLIZZARD_CLIENT_SECRET`

Optional environment variables:

- `WOW_TEST_REGION` (default: `eu`)
- `WOW_TEST_LOCALE` (default: `es_ES`)
- `WOW_TEST_REALM` (default: `zuljin`)
- `WOW_TEST_CHARACTER` (default: `ragekun`)

`npm run test` runs unit tests only.

`npm run test:live` runs live integration tests only.

`npm run test:all` runs unit + live tests.

If you configure Husky, the pre-push hook runs `npm run test:all` and blocks pushes when tests fail.