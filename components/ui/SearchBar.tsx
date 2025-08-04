import React from "react";
import { View, StyleSheet, TextInputProps, ViewStyle } from "react-native";
import { Search } from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import Input from "./Input";

interface SearchBarProps extends TextInputProps {
  containerStyle?: ViewStyle;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  containerStyle,
  onClear,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        placeholder="Search..."
        leftIcon={<Search size={20} color={COLORS.textSecondary} />}
        inputStyle={styles.input}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 40,
  },
});

export default SearchBar;