import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS, SPACING } from "@/constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case "primary":
        buttonStyle = styles.primaryButton;
        break;
      case "secondary":
        buttonStyle = styles.secondaryButton;
        break;
      case "outline":
        buttonStyle = styles.outlineButton;
        break;
      case "danger":
        buttonStyle = styles.dangerButton;
        break;
    }
    
    // Size styles
    switch (size) {
      case "small":
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case "medium":
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
        break;
      case "large":
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleVar: TextStyle = {};
    
    // Variant text styles
    switch (variant) {
      case "primary":
        textStyleVar = styles.primaryText;
        break;
      case "secondary":
        textStyleVar = styles.secondaryText;
        break;
      case "outline":
        textStyleVar = styles.outlineText;
        break;
      case "danger":
        textStyleVar = styles.dangerText;
        break;
    }
    
    // Size text styles
    switch (size) {
      case "small":
        textStyleVar = { ...textStyleVar, ...styles.smallText };
        break;
      case "medium":
        textStyleVar = { ...textStyleVar, ...styles.mediumText };
        break;
      case "large":
        textStyleVar = { ...textStyleVar, ...styles.largeText };
        break;
    }
    
    return textStyleVar;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "outline" ? COLORS.accent : COLORS.textPrimary} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Variant styles
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  secondaryButton: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  
  // Size styles
  smallButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  mediumButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  largeButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  // Text styles
  primaryText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  secondaryText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  outlineText: {
    color: COLORS.accent,
    fontWeight: "600",
  },
  dangerText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  
  // Text size styles
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
});

export default Button;