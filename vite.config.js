import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/kyc': {
        target: 'https://w1887gqeij.execute-api.us-west-2.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kyc/, '/dev/kyc'),
        secure: true,
      },
    },
  },
})
