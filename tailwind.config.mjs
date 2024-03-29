/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "vollkorn variable",
        smallcaps: "vollkorn SC",
        display: "Rakkas",
        mono: "IBM Plex Mono",
      },
    },
  },
  plugins: [],
};
