export const COLORS = {
  backgroundPrimary: "#121212",
  backgroundSecondary: "#1e1e1e",
  accent: "#E5282E",
  textPrimary: "#e0e0e0",
  textSecondary: "#a0a0a0",
  success: "#4CAF50",
  warning: "#FFC107",
  error: "#F44336",
  cardBackground: "#252525",
  border: "#333333",
  inputBackground: "#2a2a2a",
};

export const FONTS = {
  regular: {
    fontWeight: "400" as const,
  },
  medium: {
    fontWeight: "500" as const,
  },
  bold: {
    fontWeight: "700" as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 16,
  body2: 14,
  caption: 12,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
};