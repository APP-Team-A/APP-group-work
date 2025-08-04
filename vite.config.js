// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'crypto'

// 👇 Custom plugin to patch hashing
function customHashPlugin() {
  return {
    name: 'custom-hash-plugin',
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.source) {
          const hash = createHash('sha256').update(file.source).digest('hex').substring(0, 8)
          file.fileName = file.fileName.replace(/(\.[a-z]+)$/, `.${hash}$1`)
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    customHashPlugin(), // 👈 Add this line
  ],
})
