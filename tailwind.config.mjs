/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "Vollkorn",
        smallcaps: "Vollkorn SC",
        mono: "Roboto Mono",
        display: "Cooper"
      },
    },
  },
  plugins: [],
};
