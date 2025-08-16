// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#7C3AED", light: "#E0BBE4", dark: "#4F46E5" },
        accent: { blue: "#3B82F6", aqua: "#5EEAD4" },
        background: { light: "#F8F9FA", dark: "#0F172A" },
        text: { light: "#111827", dark: "#F9FAFB" },
      },
      borderRadius: { "2xl": "1.25rem" },
    },
  },
} satisfies Config;
