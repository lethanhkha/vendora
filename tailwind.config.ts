import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAF9F5",
          warm: "#F5F3ED",
          subtle: "#ECEAE2",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          warm: "#F5F3ED",
          subtle: "#ECEAE2",
        },
        ink: {
          DEFAULT: "#191817",
          secondary: "#57534E",
          muted: "#78716C",
          faint: "#A8A29E",
        },
        terracotta: {
          DEFAULT: "#B84A28",
          hover: "#98381B",
          light: "#FDF4F0",
        },
        bronze: {
          DEFAULT: "#854D0E",
          hover: "#713F12",
          light: "#FEF3C7",
        },
        ochre: {
          DEFAULT: "#B45309",
          light: "#FFFBEB",
        },
        hairline: {
          DEFAULT: "rgba(25, 24, 23, 0.08)",
          hover: "rgba(25, 24, 23, 0.16)",
        },
        // Backward-compatible tokens
        primary: {
          DEFAULT: "#191817",
          hover: "#2E2A27",
          light: "#F5F3ED",
        },
        vendor: {
          seal: "#854D0E",
          light: "#FEF3C7",
          border: "rgba(133, 77, 14, 0.2)",
        },
        accent: {
          amber: "#B45309",
          light: "#FEF3C7",
        },
        dark: {
          DEFAULT: "#191817",
          muted: "#57534E",
        },
        borderSubtle: "rgba(25, 24, 23, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        press: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(25, 24, 23, 0.04), 0 1px 1px rgba(25, 24, 23, 0.02)",
        soft: "0 1px 2px rgba(25, 24, 23, 0.04), 0 1px 1px rgba(25, 24, 23, 0.02)",
        elevate: "0 10px 25px -5px rgba(25, 24, 23, 0.06), 0 4px 10px -2px rgba(25, 24, 23, 0.03)",
        card: "0 10px 25px -5px rgba(25, 24, 23, 0.06), 0 4px 10px -2px rgba(25, 24, 23, 0.03)",
        float: "0 24px 48px -12px rgba(25, 24, 23, 0.10), 0 8px 16px -4px rgba(25, 24, 23, 0.04)",
      },
      borderRadius: {
        card: "14px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
