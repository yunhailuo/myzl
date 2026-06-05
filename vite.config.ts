import { fileURLToPath, URL } from 'node:url'

import { defineConfig, PluginOption, ResolvedConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

const isTest = process.env.VITEST === 'true'
const enableCloudflarePlugin = process.env.VITE_ENABLE_CLOUDFLARE === 'true' && !isTest

async function getPlugins() {
  let config: ResolvedConfig | undefined
  const plugins: PluginOption[] = [
    vue(),
    {
      name: 'generate-spa-fallbacks',
      apply: 'build',
      configResolved(resolvedConfig: ResolvedConfig) {
        config = resolvedConfig
      },
      closeBundle() {
        if (!config) {
          throw new Error('Cannot generate SPA fallbacks: Vite config was not resolved.')
        }

        const baseUrl = process.env.VITE_BASE_URL || '/'
        const distPath = path.resolve(config.root, config.build.outDir)
        const indexHtmlPath = path.join(distPath, 'index.html')

        if (!fs.existsSync(indexHtmlPath)) {
          throw new Error('Cannot generate SPA fallbacks: dist/index.html was not found.')
        }

        const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')
        fs.writeFileSync(path.join(distPath, '404.html'), indexHtml, 'utf-8')

        const normalizedBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`
        const fallbackPath =
          normalizedBase === '/'
            ? '/index.html'
            : `${normalizedBase.replace(/\/$/, '')}/index.html`

        fs.writeFileSync(path.join(distPath, '_redirects'), `/* ${fallbackPath} 200\n`, 'utf-8')

        console.log(`✓ Generated SPA fallbacks with base path: ${baseUrl}`)
      },
    },
  ]

  if (enableCloudflarePlugin) {
    const { cloudflare } = await import('@cloudflare/vite-plugin')
    plugins.push(cloudflare())
  }

  return plugins
}

// https://vite.dev/config/
export default defineConfig(async () => ({
  base: process.env.VITE_BASE_URL || '/',
  plugins: await getPlugins(),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
