import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { Report } from "@/types";
import { useApp } from "@/context/AppContext";
import { getReportPeriods, generateReport, formatCurrency, formatDate } from "@/utils/helpers";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";

const ReportGenerator: React.FC = () => {
  const { projects, clients, currency } = useApp();
  const reportPeriods = getReportPeriods();
  
  const [selectedPeriod, setSelectedPeriod] = useState<string>(reportPeriods[0].label);
  const [report, setReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const periodOptions = reportPeriods.map((period) => ({
    label: period.label,
    value: period.label,
  }));
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Find the selected period
    const period = reportPeriods.find((p) => p.label === selectedPeriod);
    
    if (period) {
      const generatedReport = generateReport(projects, clients, period, currency);
      setReport(generatedReport);
    }
    
    setIsGenerating(false);
  };
  
  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Exporting PDF...");
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.sectionTitle}>Generate Report</Text>
        
        <Select
          label="Report Period"
          options={periodOptions}
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        />
        
        <Button
          title="Generate Report"
          onPress={handleGenerateReport}
          loading={isGenerating}
          style={styles.generateButton}
        />
      </Card>
      
      {report && (
        <View style={styles.reportContainer}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>
              Report: {report.period.label}
            </Text>
            <Text style={styles.reportPeriod}>
              {formatDate(report.period.startDate)} - {formatDate(report.period.endDate)}
            </Text>
            
            <Button
              title="Export PDF"
              variant="outline"
              size="small"
              onPress={handleExportPDF}
              style={styles.exportButton}
            />
          </View>
          
          <Card>
            <Text style={styles.sectionTitle}>Summary</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Projects:</Text>
              <Text style={styles.summaryValue}>{report.totalProjects}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Completed Projects:</Text>
              <Text style={styles.summaryValue}>{report.completedProjects}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Income:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(report.totalIncome, currency)}
              </Text>
            </View>
          </Card>
          
          <Card>
            <Text style={styles.sectionTitle}>Projects by Service Type</Text>
            
            {report.projectBreakdown.map((item, index) => (
              <View key={index} style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownTitle}>{item.serviceType}</Text>
                  <Text style={styles.breakdownCount}>{item.count} projects</Text>
                </View>
                <Text style={styles.breakdownIncome}>
                  {formatCurrency(item.income, currency)}
                </Text>
              </View>
            ))}
          </Card>
          
          <Card>
            <Text style={styles.sectionTitle}>Projects by Client</Text>
            
            {report.clientBreakdown.map((item) => (
              <View key={item.clientId} style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownTitle}>{item.clientName}</Text>
                  <Text style={styles.breakdownCount}>{item.projectCount} projects</Text>
                </View>
                <Text style={styles.breakdownIncome}>
                  {formatCurrency(item.income, currency)}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundPrimary,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  generateButton: {
    marginTop: SPACING.md,
  },
  reportContainer: {
    marginTop: SPACING.md,
  },
  reportHeader: {
    marginBottom: SPACING.md,
  },
  reportTitle: {
    fontSize: SIZES.h3,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  reportPeriod: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  exportButton: {
    alignSelf: "flex-start",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: SIZES.body1,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  breakdownItem: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownTitle: {
    fontSize: SIZES.body1,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  breakdownCount: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.backgroundSecondary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  breakdownIncome: {
    fontSize: SIZES.body2,
    color: COLORS.accent,
    marginTop: SPACING.xs,
  },
});

export default ReportGenerator;