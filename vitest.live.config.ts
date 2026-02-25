import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/integration-live/**/*.live.test.ts'],
  },
});
