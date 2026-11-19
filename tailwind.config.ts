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
          canvas: "var(--studio-canvas)",
          panel: "var(--studio-panel)",
          elevated: "var(--studio-elevated)",
          subtle: "var(--studio-subtle)",
          border: {
            DEFAULT: "var(--studio-border)",
            subtle: "var(--studio-border-subtle)",
            strong: "var(--studio-border-strong)",
          },
          ink: {
            primary: "var(--studio-ink-primary)",
            secondary: "var(--studio-ink-secondary)",
            muted: "var(--studio-ink-muted)",
          },
          action: {
            DEFAULT: "var(--studio-action)",
            hover: "var(--studio-action-hover)",
          },
          accent: {
            DEFAULT: "var(--studio-accent)",
            hover: "var(--studio-accent-hover)",
          },
          destructive: {
            DEFAULT: "var(--studio-destructive)",
            tint: "var(--studio-destructive-tint)",
            border: "var(--studio-destructive-border)",
          },
          success: {
            DEFAULT: "var(--studio-success)",
            tint: "var(--studio-success-tint)",
            border: "var(--studio-success-border)",
          },
          warning: {
            DEFAULT: "var(--studio-warning)",
            tint: "var(--studio-warning-tint)",
            border: "var(--studio-warning-border)",
          },
          mat: "var(--studio-mat)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        xs: "0 1px 2px rgba(17, 18, 22, 0.04)",
        sm: "0 2px 4px -1px rgba(17, 18, 22, 0.05), 0 1px 2px -1px rgba(17, 18, 22, 0.03)",
        studio: "0 1px 3px rgba(17, 18, 22, 0.05), 0 8px 24px rgba(17, 18, 22, 0.04)",
        card: "0 4px 16px -2px rgba(17, 18, 22, 0.08), 0 2px 6px -1px rgba(17, 18, 22, 0.04)",
        "card-elevated": "0 20px 40px -12px rgba(17, 18, 22, 0.16), 0 4px 12px -2px rgba(17, 18, 22, 0.06)",
        float: "0 12px 32px -4px rgba(17, 18, 22, 0.12), 0 4px 8px -2px rgba(17, 18, 22, 0.04)",
        modal: "0 24px 64px -12px rgba(17, 18, 22, 0.22)",
      },
      borderRadius: {
        card: "19px",
      },
    },
  },
  plugins: [],
};

export default config;
