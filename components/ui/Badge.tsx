import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";

type BadgeVariant = "primary" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  style,
  textStyle,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryBadge;
      case "success":
        return styles.successBadge;
      case "warning":
        return styles.warningBadge;
      case "error":
        return styles.errorBadge;
      case "info":
        return styles.infoBadge;
      default:
        return styles.primaryBadge;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryText;
      case "success":
        return styles.successText;
      case "warning":
        return styles.warningText;
      case "error":
        return styles.errorText;
      case "info":
        return styles.infoText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle(), style]}>
      <Text style={[styles.text, getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: SIZES.caption,
    fontWeight: "600",
  },
  
  // Variant styles
  primaryBadge: {
    backgroundColor: `${COLORS.accent}30`,
  },
  successBadge: {
    backgroundColor: `${COLORS.success}30`,
  },
  warningBadge: {
    backgroundColor: `${COLORS.warning}30`,
  },
  errorBadge: {
    backgroundColor: `${COLORS.error}30`,
  },
  infoBadge: {
    backgroundColor: "#2196F330",
  },
  
  // Text styles
  primaryText: {
    color: COLORS.accent,
  },
  successText: {
    color: COLORS.success,
  },
  warningText: {
    color: COLORS.warning,
  },
  errorText: {
    color: COLORS.error,
  },
  infoText: {
    color: "#2196F3",
  },
});

export default Badge;