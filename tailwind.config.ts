import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1a1917",
          soft: "#3d3b35",
          muted: "#7a7870",
          faint: "#b8b6b0",
        },
        paper: {
          DEFAULT: "#f5f3ee",
          warm: "#ede9e0",
          mid: "#dbd7ce",
          border: "#ccc9c0",
        },
        accent: {
          DEFAULT: "#e84c1e",
          hover: "#cc3f15",
          soft: "#fde8e1",
        },
        signal: {
          green: "#2d7a4f",
          amber: "#b5650d",
          blue: "#1d5fa8",
        },
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "5px",
        md: "7px",
        lg: "10px",
        xl: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
