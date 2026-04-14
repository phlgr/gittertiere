import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, existsSync } from "node:fs";

const dataDir = resolve(__dirname, "../../data");

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "serve-data",
      configureServer(server) {
        server.middlewares.use("/data", (req, res, next) => {
          const filePath = resolve(dataDir, (req.url ?? "/").slice(1));
          if (existsSync(filePath)) {
            res.setHeader("Content-Type", "application/json");
            res.end(readFileSync(filePath));
          } else {
            next();
          }
        });
      },
    },
  ],
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
