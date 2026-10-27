import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  // The "~/*" alias in tsconfig.json (the build resolves it without this; the
  // dev server doesn't).
  resolve: { tsconfigPaths: true },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["noook", "noook.tsl"],
  },
});
