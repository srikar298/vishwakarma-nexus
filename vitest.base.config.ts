import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// Root-level base configuration for all Vitest projects in the monorepo
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // Explicit fallbacks for monorepo resolution
      '@vishwakarma-k-c/shared': path.resolve(__dirname, 'libs/shared/src/index.ts'),
      '@vishwakarma-k-c/db': path.resolve(__dirname, 'libs/db/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nx/**',
    ],
    // Force Vitest to process our internal workspace packages instead of treating them as external
    server: {
      deps: {
        inline: [/@vishwakarma-k-c\/.*/],
        fallbackCJS: true,
      },
    },
  },
});
