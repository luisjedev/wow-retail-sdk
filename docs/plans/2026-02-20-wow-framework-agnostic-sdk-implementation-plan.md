# WoW Framework-Agnostic SDK Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a framework-agnostic TypeScript SDK for WoW Armory + PvP MVP with one exported function per endpoint and secure token injection via `tokenProvider`.

**Architecture:** The SDK uses a small layered design: `client` (public API factory), `http` (single request pipeline), `endpoints` (domain modules), and `types/errors` (contracts). Authentication is delegated to user-provided `tokenProvider`, so no Blizzard secrets are stored in SDK runtime state.

**Tech Stack:** TypeScript, Node 20+, Vitest, tsup, npm.

---

### Task 1: Bootstrap package and toolchain

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsup.config.ts`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/index.ts`
- Test: `test/smoke/bootstrap.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import * as sdk from '../../src/index';

describe('bootstrap', () => {
	it('exports createWowClient', () => {
		expect(typeof sdk.createWowClient).toBe('function');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/smoke/bootstrap.test.ts`
Expected: FAIL with "createWowClient is not exported".

**Step 3: Write minimal implementation**

```ts
export const createWowClient = () => ({});
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/smoke/bootstrap.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add package.json tsconfig.json tsup.config.ts vitest.config.ts .gitignore src/index.ts test/smoke/bootstrap.test.ts
git commit -m "chore: bootstrap wow sdk package"
```

### Task 2: Define core contracts and config validation

**Files:**
- Create: `src/types/config.ts`
- Create: `src/types/common.ts`
- Create: `src/client/create-wow-client.ts`
- Modify: `src/index.ts`
- Test: `test/client/create-wow-client.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { createWowClient } from '../../src';

describe('createWowClient', () => {
	it('throws when tokenProvider is missing', () => {
		expect(() => createWowClient({ region: 'eu', locale: 'es_ES' } as never)).toThrow();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/client/create-wow-client.test.ts`
Expected: FAIL because validation does not exist.

**Step 3: Write minimal implementation**

```ts
export type WowRegion = 'us' | 'eu' | 'kr' | 'tw';
export type TokenProvider = () => Promise<string>;

export interface WowClientConfig {
	region: WowRegion;
	locale: string;
	tokenProvider: TokenProvider;
}

export function createWowClient(config: WowClientConfig) {
	if (!config?.tokenProvider) throw new Error('tokenProvider is required');
	return {};
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/client/create-wow-client.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/types/config.ts src/types/common.ts src/client/create-wow-client.ts src/index.ts test/client/create-wow-client.test.ts
git commit -m "feat: add client config contracts and validation"
```

### Task 3: Implement typed error model

**Files:**
- Create: `src/errors.ts`
- Test: `test/http/errors.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { WowNotFoundError } from '../../src/errors';

describe('errors', () => {
	it('creates WowNotFoundError with status 404', () => {
		const error = new WowNotFoundError('not found', { status: 404, path: '/x' });
		expect(error.status).toBe(404);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/http/errors.test.ts`
Expected: FAIL with missing class.

**Step 3: Write minimal implementation**

```ts
export class WowApiError extends Error {
	constructor(message: string, public meta: { status: number; path: string }) {
		super(message);
	}
	get status() { return this.meta.status; }
}

export class WowNotFoundError extends WowApiError {}
export class WowAuthError extends WowApiError {}
export class WowRateLimitError extends WowApiError {}
export class WowValidationError extends Error {}
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/http/errors.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/errors.ts test/http/errors.test.ts
git commit -m "feat: add typed wow sdk errors"
```

### Task 4: Build HTTP request pipeline with namespace + auth

**Files:**
- Create: `src/http/request.ts`
- Create: `src/http/url.ts`
- Modify: `src/client/create-wow-client.ts`
- Test: `test/http/request.test.ts`

**Step 1: Write the failing test**

```ts
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
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/http/request.test.ts`
Expected: FAIL with missing request module.

**Step 3: Write minimal implementation**

```ts
export async function requestJson(opts: any) {
	const token = await opts.tokenProvider();
	const url = `https://${opts.region}.api.blizzard.com${opts.path}?namespace=${opts.namespace}&locale=${opts.locale}`;
	const response = await opts.fetchImpl(url, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) throw new Error('request failed');
	return response.json();
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/http/request.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/http/request.ts src/http/url.ts src/client/create-wow-client.ts test/http/request.test.ts
git commit -m "feat: add authenticated request pipeline"
```

### Task 5: Implement Character endpoints

**Files:**
- Create: `src/endpoints/character.ts`
- Modify: `src/client/create-wow-client.ts`
- Test: `test/endpoints/character.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, vi } from 'vitest';
import { createWowClient } from '../../src';

describe('character endpoints', () => {
	it('calls profile endpoint with profile namespace', async () => {
		const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
		const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 't', fetchImpl });
		await wow.getCharacterProfile({ realmSlug: 'ravencrest', characterName: 'thrall' });
		expect(fetchImpl.mock.calls[0][0]).toContain('/profile/wow/character/ravencrest/thrall');
		expect(fetchImpl.mock.calls[0][0]).toContain('namespace=profile-eu');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/endpoints/character.test.ts`
Expected: FAIL with missing method.

**Step 3: Write minimal implementation**

```ts
export function buildCharacterEndpoints(ctx: any) {
	return {
		getCharacterProfile: ({ realmSlug, characterName }: any) =>
			ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}`, namespace: `profile-${ctx.region}` }),
		getCharacterStatus: ({ realmSlug, characterName }: any) =>
			ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/status`, namespace: `profile-${ctx.region}` }),
	};
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/endpoints/character.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/endpoints/character.ts src/client/create-wow-client.ts test/endpoints/character.test.ts
git commit -m "feat: add character profile and status endpoints"
```

### Task 6: Implement Character PvP endpoints

**Files:**
- Create: `src/endpoints/pvp-character.ts`
- Modify: `src/client/create-wow-client.ts`
- Test: `test/endpoints/pvp-character.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, vi } from 'vitest';
import { createWowClient } from '../../src';

describe('pvp character endpoints', () => {
	it('calls pvp summary endpoint', async () => {
		const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
		const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 't', fetchImpl });
		await wow.getCharacterPvpSummary({ realmSlug: 'ravencrest', characterName: 'thrall' });
		expect(fetchImpl.mock.calls[0][0]).toContain('/pvp-summary');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/endpoints/pvp-character.test.ts`
Expected: FAIL with missing method.

**Step 3: Write minimal implementation**

```ts
export function buildPvpCharacterEndpoints(ctx: any) {
	return {
		getCharacterPvpSummary: ({ realmSlug, characterName }: any) =>
			ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-summary`, namespace: `profile-${ctx.region}` }),
		getCharacterPvpBracket: ({ realmSlug, characterName, bracket }: any) =>
			ctx.request({ path: `/profile/wow/character/${realmSlug}/${characterName}/pvp-bracket/${bracket}`, namespace: `profile-${ctx.region}` }),
	};
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/endpoints/pvp-character.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/endpoints/pvp-character.ts src/client/create-wow-client.ts test/endpoints/pvp-character.test.ts
git commit -m "feat: add pvp character endpoints"
```

### Task 7: Implement PvP Season endpoints

**Files:**
- Create: `src/endpoints/pvp-season.ts`
- Modify: `src/client/create-wow-client.ts`
- Test: `test/endpoints/pvp-season.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, vi } from 'vitest';
import { createWowClient } from '../../src';

describe('pvp season endpoints', () => {
	it('uses dynamic namespace for seasons index', async () => {
		const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
		const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 't', fetchImpl });
		await wow.getPvpSeasonsIndex();
		expect(fetchImpl.mock.calls[0][0]).toContain('/data/wow/pvp-season/index');
		expect(fetchImpl.mock.calls[0][0]).toContain('namespace=dynamic-eu');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/endpoints/pvp-season.test.ts`
Expected: FAIL with missing method.

**Step 3: Write minimal implementation**

```ts
export function buildPvpSeasonEndpoints(ctx: any) {
	return {
		getPvpSeasonsIndex: () => ctx.request({ path: '/data/wow/pvp-season/index', namespace: `dynamic-${ctx.region}` }),
		getPvpSeason: ({ seasonId }: any) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}`, namespace: `dynamic-${ctx.region}` }),
		getPvpLeaderboardsIndex: ({ seasonId }: any) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/index`, namespace: `dynamic-${ctx.region}` }),
		getPvpLeaderboard: ({ seasonId, bracket }: any) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-leaderboard/${bracket}`, namespace: `dynamic-${ctx.region}` }),
		getPvpRewardsIndex: ({ seasonId }: any) => ctx.request({ path: `/data/wow/pvp-season/${seasonId}/pvp-reward/index`, namespace: `dynamic-${ctx.region}` }),
	};
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/endpoints/pvp-season.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/endpoints/pvp-season.ts src/client/create-wow-client.ts test/endpoints/pvp-season.test.ts
git commit -m "feat: add pvp season endpoints"
```

### Task 8: Wire exports and public types

**Files:**
- Modify: `src/index.ts`
- Create: `test/public-api/public-surface.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { createWowClient } from '../../src';

describe('public api', () => {
	it('client exposes nine MVP endpoint functions', () => {
		const wow = createWowClient({ region: 'eu', locale: 'es_ES', tokenProvider: async () => 'x', fetchImpl: async () => ({ ok: true, json: async () => ({}) }) as never });
		expect(typeof wow.getCharacterProfile).toBe('function');
		expect(typeof wow.getCharacterStatus).toBe('function');
		expect(typeof wow.getCharacterPvpSummary).toBe('function');
		expect(typeof wow.getCharacterPvpBracket).toBe('function');
		expect(typeof wow.getPvpSeasonsIndex).toBe('function');
		expect(typeof wow.getPvpSeason).toBe('function');
		expect(typeof wow.getPvpLeaderboardsIndex).toBe('function');
		expect(typeof wow.getPvpLeaderboard).toBe('function');
		expect(typeof wow.getPvpRewardsIndex).toBe('function');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/public-api/public-surface.test.ts`
Expected: FAIL until all methods are exported.

**Step 3: Write minimal implementation**

```ts
export { createWowClient } from './client/create-wow-client';
export type { WowClientConfig, WowRegion, TokenProvider } from './types/config';
export * from './errors';
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/public-api/public-surface.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/index.ts test/public-api/public-surface.test.ts
git commit -m "feat: expose stable public sdk surface"
```

### Task 9: Documentation and safety guidance

**Files:**
- Create: `README.md`
- Test: `test/docs/readme-snippet.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('README', () => {
	it('includes security warning for frontend secrets', () => {
		const readme = readFileSync('README.md', 'utf8');
		expect(readme).toContain('Do not expose Blizzard client_secret in frontend code');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test test/docs/readme-snippet.test.ts`
Expected: FAIL if README is missing.

**Step 3: Write minimal implementation**

```md
# wow-sdk

## Quick start

```ts
const wow = createWowClient({
	region: 'eu',
	locale: 'es_ES',
	tokenProvider: async () => getTokenFromBackend(),
});
```

Do not expose Blizzard client_secret in frontend code.
```

**Step 4: Run test to verify it passes**

Run: `npm run test test/docs/readme-snippet.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add README.md test/docs/readme-snippet.test.ts
git commit -m "docs: add integration and security guidance"
```

### Task 10: Final quality gate

**Files:**
- Modify: `package.json` (if scripts need adjustment)

**Step 1: Run focused tests**

Run: `npm run test test/endpoints/character.test.ts test/endpoints/pvp-character.test.ts test/endpoints/pvp-season.test.ts`
Expected: PASS.

**Step 2: Run full test suite**

Run: `npm run test`
Expected: PASS.

**Step 3: Run build**

Run: `npm run build`
Expected: PASS and emits `dist/` with JS + d.ts.

**Step 4: Commit release-ready state**

```bash
git add .
git commit -m "chore: release-ready wow sdk mvp"
```

**Step 5: Tag local version**

```bash
npm version 0.1.0
```

## References

- @brainstorming design baseline: `docs/plans/2026-02-20-wow-framework-agnostic-sdk-design.md`
- Blizzard WoW Profile and Game Data docs (Armory/PvP endpoints)

## Done checklist

- `createWowClient` available.
- 9 MVP endpoint functions available.
- Typed errors mapped for 401/403/404/429/5xx.
- README includes backend-only secret guidance.
- `npm run test` and `npm run build` pass.
