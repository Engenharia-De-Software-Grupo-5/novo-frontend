import type { Config } from "tailwindcss";
import * as tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores customizadas conforme solicitado
        brand: {
          blue: "#1447E6",
          white: "#FFFFFF",
          background: "#F7F7F8",
          dark: "#09090B",
          gray: "#71717B",
          "blue-text": "#EFF6FF", // Texto para botão azul
          yellow_bg: "#FCEBDC",
          red_light: "#FDE6E7",
          red_vivid: "#E7000B",
        },
        // Ajustando cores padrão do shadcn para usar suas variáveis
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#1447E6", // Ring azul padrão
        background: "#F7F7F8",
        foreground: "#09090B",
      },
      spacing: {
        '4': '1rem',    // 16px
        '8': '2rem',    // 32px
        '12': '3rem',   // 48px
      }
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;