import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design token: You can add custom colors here if needed
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px rgba(0,0,0,1)',
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
      }
    },
  },
  plugins: [],
};
export default config;
