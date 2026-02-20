import { describe, it, expect } from 'vitest';
import * as sdk from '../../src/index';

describe('bootstrap', () => {
  it('exports createWowClient', () => {
    expect(typeof (sdk as { createWowClient?: unknown }).createWowClient).toBe('function');
  });
});
