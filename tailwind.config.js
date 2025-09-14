/** @type {import('tailwindcss').Config} */
import { COLORS } from "./src/constants/colors";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: COLORS.PRIMARY,
          light: COLORS.PRIMARY_LIGHT,
          dark: COLORS.PRIMARY_DARK,
        },
        // Giữ các màu mặc định của Tailwind
        ...COLORS,
      },
    },
  },
  plugins: [],
};
