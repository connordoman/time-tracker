const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            spacing: {
                terminal: "80ch",
                "terminal-align": "calc((100vw - 80ch) / 2)",
            },
        },
    },
    darkMode: "class",
    plugins: [nextui()],
};
