import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __COMPANION_PORT__: JSON.stringify(process.env.BOB_COMPANION_PORT || "8765"),
  },
});
