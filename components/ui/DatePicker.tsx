import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { COLORS, SPACING, SIZES } from "@/constants/theme";

interface DatePickerProps {
  label?: string;
  value?: string; // ISO string
  onValueChange: (value: string) => void; // ISO string
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  dateStyle?: ViewStyle;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onValueChange,
  placeholder = "Select a date",
  error,
  containerStyle,
  labelStyle,
  dateStyle,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const selectedDate = value ? parseISO(value) : undefined;
  
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    
    if (date) {
      onValueChange(date.toISOString());
    }
  };
  
  const showDatePicker = () => {
    setShowPicker(true);
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dateContainer,
          error ? styles.dateError : null,
          dateStyle,
        ]}
        onPress={showDatePicker}
      >
        <Text
          style={[
            styles.dateText,
            !selectedDate && styles.placeholderText,
          ]}
        >
          {selectedDate
            ? format(selectedDate, "MMM d, yyyy")
            : placeholder}
        </Text>
        <Calendar size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          style={styles.datePicker}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    fontSize: SIZES.body2,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  dateError: {
    borderColor: COLORS.error,
  },
  dateText: {
    color: COLORS.textPrimary,
    fontSize: SIZES.body1,
  },
  placeholderText: {
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.caption,
    marginTop: SPACING.xs,
  },
  datePicker: {
    backgroundColor: COLORS.backgroundPrimary,
  },
});

export default DatePicker;