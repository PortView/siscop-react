import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /^gap-/ },
    { pattern: /^w-/ },
    { pattern: /^h-/ },
    { pattern: /^text-/ },
    { pattern: /^bg-/ },
  ],
  plugins: [require("tailwind-scrollbar")],
  theme: {
    extend: {
      screens: {
        '2xlb': '1670px', // você pode usar qualquer nome, mas '2xl' é uma boa escolha
      },
    },
  },

};
module.exports = config;
