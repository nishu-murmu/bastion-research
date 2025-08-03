import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/digio-api-sandbox': {
        target: 'https://ext.digio.in:444',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/digio-api-sandbox/, ''),
        headers: {
          'Origin': 'https://ext.digio.in:444'
        }
      },
      '/digio-api-prod': {
        target: 'https://api.digio.in',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/digio-api-prod/, ''),
        headers: {
          'Origin': 'https://api.digio.in'
        }
      },
    },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
