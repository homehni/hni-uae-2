import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { cpSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";

// Derive __dirname safely in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy public/homehni to dist/public/homehni after build
const copyHomehniPlugin = () => ({
  name: "copy-homehni",
  closeBundle() {
    const srcDir = path.resolve(__dirname, "public/homehni");
    const destDir = path.resolve(__dirname, "dist/public/homehni");

    if (existsSync(srcDir)) {
      if (!existsSync(path.dirname(destDir))) {
        mkdirSync(path.dirname(destDir), { recursive: true });
      }
      cpSync(srcDir, destDir, { recursive: true });
      console.log("✅ Copied public/homehni to dist/public/homehni");
    }
  },
});

export default defineConfig(async () => {
  const plugins: any[] = [
    react(),
    runtimeErrorOverlay(),
    copyHomehniPlugin(),
  ];

  // Only import Replit-specific dev plugins when needed and available
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const carto = await import("@replit/vite-plugin-cartographer");
      const devBanner = await import("@replit/vite-plugin-dev-banner");
      if (carto?.cartographer) plugins.push(carto.cartographer());
      if (devBanner?.devBanner) plugins.push(devBanner.devBanner());
    } catch (e) {
      // Fail gracefully if replit dev plugins are not present in the environment
      console.warn("Replit dev plugins not available:", e?.message || e);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    base: "/",
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      assetsDir: "assets",
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
