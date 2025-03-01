import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@components": path.resolve(__dirname, "src/components"),
            "@core": path.resolve(__dirname, "src/core"),
            "@icons": path.resolve(__dirname, "src/icons"),
            "@layouts": path.resolve(__dirname, "src/layouts"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@ui": path.resolve(__dirname, "src/ui"),
            "@store": path.resolve(__dirname, "src/store"),
        },
    },
});
