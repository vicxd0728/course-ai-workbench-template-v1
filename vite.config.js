import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        workbench: "index.html",
        guide: "guide.html"
      }
    }
  }
});
