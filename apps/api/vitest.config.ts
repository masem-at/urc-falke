import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@urc-falke/shared': resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@urc-falke/shared/db': resolve(__dirname, '../../packages/shared/src/db/index.ts'),
      '@urc-falke/shared/types': resolve(__dirname, '../../packages/shared/src/types/index.ts'),
      '@urc-falke/shared/schemas': resolve(__dirname, '../../packages/shared/src/schemas/auth.schema.ts')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    env: {
      // Test environment variables
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-for-jwt-signing-minimum-32-characters-long'
    }
  }
});
