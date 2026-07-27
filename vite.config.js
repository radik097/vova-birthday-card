import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    base: "/vova-birthday-card/",
    build: {
        outDir: "dist",
        assetsDir: "assets",
    },
    server: {
        open: true,
        port: 3000,
    },
});
