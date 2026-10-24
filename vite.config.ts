import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const previewCleanUrlsPlugin = (): Plugin => ({
  name: 'preview-clean-urls',
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url ? req.url.split('?')[0] : '';
      if (url && !url.includes('.')) {
        const cleanPath = url.replace(/^\/+/, '').replace(/\/+$/, '');
        const distDir = path.resolve(process.cwd(), 'dist');
        const fileHtml = path.join(distDir, `${cleanPath}.html`);
        const dirHtml = path.join(distDir, cleanPath, 'index.html');

        if (cleanPath && fs.existsSync(fileHtml)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(fileHtml, 'utf8'));
          return;
        } else if (cleanPath && fs.existsSync(dirHtml)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(dirHtml, 'utf8'));
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), previewCleanUrlsPlugin()],
})
