import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('README', () => {
  it('includes security warning for frontend secrets', () => {
    const readme = readFileSync('README.md', 'utf8');
    expect(readme).toContain('Do not expose Blizzard client_secret in frontend code');
  });
});
