import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { cpSync, existsSync, mkdirSync } from "fs";

// Copy public/homehni to dist/public/homehni after build
const copyHomehniPlugin = () => ({
  name: 'copy-homehni',
  closeBundle() {
    const srcDir = path.resolve(import.meta.dirname, "public/homehni");
    const destDir = path.resolve(import.meta.dirname, "dist/public/homehni");
    
    if (existsSync(srcDir)) {
      if (!existsSync(path.dirname(destDir))) {
        mkdirSync(path.dirname(destDir), { recursive: true });
      }
      cpSync(srcDir, destDir, { recursive: true });
      console.log('✅ Copied public/homehni to dist/public/homehni');
    }
  }
});

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    copyHomehniPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "/",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
