// Màu sắc chính của ứng dụng
export const COLORS = {
  PRIMARY: "#7d4700",
  PRIMARY_LIGHT: "#a36200",
  PRIMARY_DARK: "#5a3300",
  SECONDARY: "#4a5568",
  ACCENT: "#ecc94b",
  SUCCESS: "#38a169",
  WARNING: "#dd6b20",
  ERROR: "#e53e3e",
  WHITE: "#ffffff",
  GRAY_50: "#f9fafb",
  GRAY_100: "#f7fafc",
  GRAY_200: "#edf2f7",
  GRAY_300: "#e2e8f0",
  GRAY_400: "#cbd5e0",
  GRAY_500: "#a0aec0",
  GRAY_600: "#718096",
  GRAY_700: "#4a5568",
  GRAY_800: "#2d3748",
  GRAY_900: "#1a202c",
  BLACK: "#000000",
} as const;

// Export type cho TypeScript
export type ColorKey = keyof typeof COLORS;
