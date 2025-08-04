import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import Card from "../ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, style }) => {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: SIZES.h3,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}20`,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StatCard;