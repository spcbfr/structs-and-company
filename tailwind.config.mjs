/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "vollkorn",
        smallcaps: "vollkorn SC",
        mono: "Roboto Mono",
      },
      colors: {
        'sage': {
          '50': '#faf9f5',
          '100': '#f1eee3',
          '200': '#e2dcc6',
          '300': '#cfc4a2',
          '400': '#bba77c',
          '500': '#ad9362',
          '600': '#a08156',
          '700': '#856949',
          '800': '#6d563f',
          '900': '#35321C',
          '950': '#1B190E',
        },
      }
    },
  },
  plugins: [],
};
