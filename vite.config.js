import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['crapp_app_icon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'CrApp',
        short_name: 'CrApp',
        description: 'An app for the toilet',
        theme_color: '#0f172a', /* slate-900 */
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'crapp_app_icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'crapp_app_icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
