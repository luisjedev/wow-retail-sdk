import 'dotenv/config';
import { createWowClient } from '../../../src';
import type { WowRegion } from '../../../src';

const DEFAULT_REGION: WowRegion = 'eu';
const DEFAULT_LOCALE = 'es_ES';
const DEFAULT_REALM = 'zuljin';
const DEFAULT_CHARACTER = 'ragekun';

type TokenResponse = {
  access_token: string;
};

export function getRequiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required for live integration tests`);
  }
  return value;
}

export function getLiveRegion(): WowRegion {
  const region = process.env.WOW_TEST_REGION ?? process.env.WOW_REGION;
  if (!region) return DEFAULT_REGION;
  if (region === 'us' || region === 'eu' || region === 'kr' || region === 'tw') return region;
  throw new Error('WOW_TEST_REGION must be one of us, eu, kr, tw');
}

export function getLiveLocale(): string {
  return process.env.WOW_TEST_LOCALE ?? process.env.WOW_LOCALE ?? DEFAULT_LOCALE;
}

export function getLiveRealm(): string {
  return (process.env.WOW_TEST_REALM ?? process.env.WOW_REALM_SLUG ?? DEFAULT_REALM).toLowerCase();
}

export function getLiveCharacter(): string {
  return (process.env.WOW_TEST_CHARACTER ?? process.env.WOW_CHARACTER_NAME ?? DEFAULT_CHARACTER).toLowerCase();
}

async function fetchAccessToken(region: WowRegion, clientId: string, clientSecret: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const oauthUrl = `https://oauth.battle.net/token`;

  const response = await fetch(oauthUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token request failed for ${region}: ${response.status} ${body}`);
  }

  const token = (await response.json()) as TokenResponse;
  if (!token.access_token) {
    throw new Error('Token response did not include access_token');
  }
  return token.access_token;
}

export function createLiveWowClient() {
  const region = getLiveRegion();
  const locale = getLiveLocale();
  const clientId = getRequiredEnv('BLIZZARD_CLIENT_ID', process.env.BLIZZARD_CLIENT_ID);
  const clientSecret = getRequiredEnv('BLIZZARD_CLIENT_SECRET', process.env.BLIZZARD_CLIENT_SECRET);

  let cachedToken: string | null = null;

  return createWowClient({
    region,
    locale,
    tokenProvider: async () => {
      if (cachedToken) return cachedToken;
      cachedToken = await fetchAccessToken(region, clientId, clientSecret);
      return cachedToken;
    },
  });
}
