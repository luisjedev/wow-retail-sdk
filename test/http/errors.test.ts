import { describe, it, expect } from 'vitest';
import { WowNotFoundError } from '../../src/errors';

describe('errors', () => {
  it('creates WowNotFoundError with status 404', () => {
    const error = new WowNotFoundError('not found', { status: 404, path: '/x' });
    expect(error.status).toBe(404);
  });
});
