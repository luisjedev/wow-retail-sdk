import { describe, it, expect } from 'vitest';
import { createWowClient } from '../../src';

describe('createWowClient', () => {
  it('throws when tokenProvider is missing', () => {
    expect(() => createWowClient({ region: 'eu', locale: 'es_ES' } as never)).toThrow();
  });
});
