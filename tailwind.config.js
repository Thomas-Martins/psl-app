import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                right: "2px 0 10px rgba(0, 0, 0, 0.2)",
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};
