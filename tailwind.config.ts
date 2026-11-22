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
        studio: {
          canvas: "#F6F5F1",
          panel: "#FFFFFF",
          subtle: "#EFECE5",
          border: "#E3DFD6",
          ink: {
            primary: "#181A1F",
            secondary: "#5A5E69",
            muted: "#8C909C",
          },
          action: {
            DEFAULT: "#1B365D",
            hover: "#142947",
          },
          destructive: {
            DEFAULT: "#B42318",
            tint: "#FEF3F2",
          },
          success: {
            DEFAULT: "#157347",
            tint: "#ECFDF3",
          },
          mat: "#E9E6DE",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        studio: "0 1px 3px rgba(24, 26, 31, 0.05), 0 8px 24px rgba(24, 26, 31, 0.04)",
        card: "0 4px 20px -2px rgba(24, 26, 31, 0.08), 0 2px 6px -1px rgba(24, 26, 31, 0.04)",
        "card-elevated": "0 20px 40px -12px rgba(24, 26, 31, 0.16), 0 4px 12px -2px rgba(24, 26, 31, 0.06)",
        float: "0 12px 32px -4px rgba(24, 26, 31, 0.12), 0 4px 8px -2px rgba(24, 26, 31, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
