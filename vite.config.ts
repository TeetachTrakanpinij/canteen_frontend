import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // ทุก request ที่ขึ้นต้นด้วย /api จะถูกส่งไปยัง backend จริง
      '/api': {
        target: 'https://canteen-backend-ten.vercel.app',
        changeOrigin: true,
        secure: true, // ใช้ https
      },
    },
  },
});

