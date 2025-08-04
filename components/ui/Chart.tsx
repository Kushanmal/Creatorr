import React from "react";
import { View, Text, StyleSheet, Dimensions, ViewStyle, Platform } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { ChartData } from "@/types";

type ChartType = "line" | "bar" | "pie";

interface ChartProps {
  type: ChartType;
  data: ChartData;
  title?: string;
  height?: number;
  style?: ViewStyle;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  height = 220,
  style,
}) => {
  const screenWidth = Dimensions.get("window").width - SPACING.md * 2;
  
  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: COLORS.cardBackground,
    backgroundGradientTo: COLORS.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(229, 40, 46, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(224, 224, 224, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: COLORS.accent,
    },
  };
  
  const renderChart = () => {
    // For web, show a simple fallback to avoid SVG gesture handler issues
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.webChartFallback, { height }]}>
          <Text style={styles.webChartTitle}>{title}</Text>
          <View style={styles.webChartData}>
            {data.labels.map((label, index) => (
              <View key={label} style={styles.webChartItem}>
                <Text style={styles.webChartLabel}>{label}</Text>
                <Text style={styles.webChartValue}>{data.datasets[0].data[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    switch (type) {
      case "line":
        return (
          <LineChart
            data={{
              labels: data.labels,
              datasets: [
                {
                  data: data.datasets[0].data,
                },
              ],
            }}
            width={screenWidth}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      case "bar":
        return (
          <BarChart
            data={{
              labels: data.labels,
              datasets: [
                {
                  data: data.datasets[0].data,
                },
              ],
            }}
            width={screenWidth}
            height={height}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix=""
            style={styles.chart}
          />
        );
      case "pie":
        const pieData = data.labels.map((label, index) => ({
          name: label,
          population: data.datasets[0].data[index],
          color: data.datasets[0].colors?.[index] || `rgba(229, 40, 46, ${0.7 + index * 0.1})`,
          legendFontColor: COLORS.textPrimary,
          legendFontSize: 12,
        }));
        
        return (
          <PieChart
            data={pieData}
            width={screenWidth}
            height={height}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  chart: {
    borderRadius: 16,
  },
  webChartFallback: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
  webChartTitle: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  webChartData: {
    width: "100%",
  },
  webChartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  webChartLabel: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  webChartValue: {
    fontSize: SIZES.body2,
    fontWeight: "600",
    color: COLORS.accent,
  },
});

export default Chart;