import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/dlx-client/", // Base directory
  build: {
    outDir: "../public/dlx-client", // Directory where this project is built in
    emptyOutDir: true, // Deleting the existing files whenever you build
  },
});
