import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Include .tsx files
      include: "**/*.{jsx,tsx}",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true, // Fail if port is not available (important for Tauri)
    hmr: {
      // Enable HMR
      protocol: "ws",
      host: "localhost",
      port: 1420,
    },
    watch: {
      // Tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
      // Use polling for better file watching (useful in some environments)
      usePolling: false,
    },
  },
  // Optimize dependencies for faster HMR
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});

