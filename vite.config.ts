import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

// vite plugins
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import Fonts from "unplugin-fonts/vite";
// @ts-expect-error "vite-plugin-imagemin" has no exported member "imagemin"
import imagemin from "unplugin-imagemin/vite";
import { compression } from "vite-plugin-compression2";
import Inspect from "vite-plugin-inspect";
import svgr from "vite-plugin-svgr";

import { fonts } from "./configs/fonts.config";

// Prefer explicit env var VITE_BASE. If not provided, default to '/' for local dev.
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [
    svgr(),
    react(),
    Inspect(),
    compression(),
    imagemin(),
    tailwindcss(),
    Fonts({ google: { families: fonts } }),
    AutoImport({
      imports: ["react", "react-router"],
      dts: "./auto-imports.d.ts",
      eslintrc: { filepath: "./eslint.config.js" },
      dirs: ["./src/components/ui"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
