import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import type { ConfigEnv } from 'vite'

const { default: viteConfig } = await import('./vite.config')
const resolvedViteConfig =
  typeof viteConfig === 'function'
    ? await viteConfig({ command: 'build', mode: 'test' } as ConfigEnv)
    : viteConfig

export default mergeConfig(
  resolvedViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**', '.stryker-tmp/**', 'reports/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          ...(configDefaults.coverage.exclude || []),
          'e2e/**',
          '.stryker-tmp/**',
          'reports/**',
          '**/*.d.ts',
          '**/*.spec.ts',
          '**/*.test.ts',
        ],
      },
    },
  }),
)
