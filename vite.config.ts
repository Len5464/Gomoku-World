import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcssNesting from "postcss-nesting";
export default defineConfig({
  base: "https://len5464.github.io/Gomoku-World/",
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [postcssNesting()],
    },
  },
});
