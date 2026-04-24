import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [
    vue(),
    // 自定义插件：在构建后生成带有正确 base 路径的 404.html
    {
      name: 'generate-404-html',
      closeBundle() {
        const baseUrl = process.env.VITE_BASE_URL || '/'
        const distPath = path.resolve(__dirname, 'dist')
        const html404Path = path.join(distPath, '404.html')
        
        const html404Content = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>myzl - 加载中...</title>
  <script>
    // SPA 路由重定向 - 适用于任何静态托管平台
    (function() {
      var path = window.location.pathname;
      var search = window.location.search;
      var hash = window.location.hash;
      
      // Base 路径（由 Vite 构建时注入）
      var basePath = '${baseUrl}';
      
      // 确保 basePath 格式正确
      if (basePath && !basePath.startsWith('/')) {
        basePath = '/' + basePath;
      }
      if (basePath && basePath !== '/' && basePath.endsWith('/')) {
        basePath = basePath.slice(0, -1);
      }
      
      // 重定向到 index.html，并通过 URL 参数传递原始路径
      var redirectUrl = basePath + '/index.html' + '?redirect=' + encodeURIComponent(path + search + hash);
      window.location.replace(redirectUrl);
    })();
  </script>
</head>
<body>
  <p>正在加载...</p>
</body>
</html>`
        
        fs.writeFileSync(html404Path, html404Content, 'utf-8')
        console.log(`✓ Generated 404.html with base path: ${baseUrl}`)
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
