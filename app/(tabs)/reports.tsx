import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import ReportGenerator from "@/components/reports/ReportGenerator";

export default function ReportsScreen() {
  const { isLoading } = useApp();
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>
      
      <ReportGenerator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundPrimary,
  },
  loadingText: {
    color: COLORS.textPrimary,
    fontSize: SIZES.body1,
  },
  header: {
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});