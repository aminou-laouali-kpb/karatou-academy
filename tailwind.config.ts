import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          50: "#F0F7FF",
          100: "#E8F2FF",
          300: "#8EC5FF",
          400: "#4A9EF5",
          500: "#1A73E8",
          600: "#1A52CC",
          700: "#1035A0",
          800: "#0D2245",
          900: "#0A1628",
        },
        gold: {
          50: "#FFFBF0",
          100: "#FEF3D8",
          300: "#FAC55A",
          400: "#F5A623",
          500: "#E8960C",
          600: "#C47D0A",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          300: "#D1D5DB",
          500: "#6B7280",
          700: "#374151",
          900: "#111827",
        },
        success: "#16A34A",
        error: "#DC2626",
        warning: "#D97706",
        info: "#0284C7",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "32px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(26,115,232,.08), 0 1px 2px rgba(0,0,0,.04)",
        md: "0 4px 16px rgba(26,115,232,.12), 0 2px 8px rgba(0,0,0,.06)",
        lg: "0 12px 40px rgba(26,115,232,.16), 0 4px 16px rgba(0,0,0,.08)",
        gold: "0 4px 20px rgba(245,166,35,.30)",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
