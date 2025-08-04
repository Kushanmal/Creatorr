import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { Currency } from "@/types";
import { useApp } from "@/context/AppContext";

const CurrencySelector: React.FC = () => {
  const { currency, updateCurrency } = useApp();
  
  const handleCurrencyChange = (newCurrency: Currency) => {
    updateCurrency(newCurrency);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.currencyButton,
          currency === "LKR" && styles.activeCurrency,
        ]}
        onPress={() => handleCurrencyChange("LKR")}
      >
        <Text
          style={[
            styles.currencyText,
            currency === "LKR" && styles.activeCurrencyText,
          ]}
        >
          LKR
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.currencyButton,
          currency === "USD" && styles.activeCurrency,
        ]}
        onPress={() => handleCurrencyChange("USD")}
      >
        <Text
          style={[
            styles.currencyText,
            currency === "USD" && styles.activeCurrencyText,
          ]}
        >
          USD
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 2,
  },
  currencyButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 6,
  },
  activeCurrency: {
    backgroundColor: COLORS.accent,
  },
  currencyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.caption,
    fontWeight: "600",
  },
  activeCurrencyText: {
    color: COLORS.textPrimary,
  },
});

export default CurrencySelector;