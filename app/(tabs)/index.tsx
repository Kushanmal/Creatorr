import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Briefcase, DollarSign, Clock, CheckCircle, AlertTriangle, Plus } from "lucide-react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { formatCurrency, generateStatusChartData, generateMonthlyIncomeData } from "@/utils/helpers";
import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import Chart from "@/components/ui/Chart";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import CurrencySelector from "@/components/dashboard/CurrencySelector";

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { projects, clients, currency, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  
  const isTablet = width >= 768;
  
  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === "ongoing").length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const overdueProjects = projects.filter((p) => p.status === "overdue").length;
    
    // Calculate total income (completed projects only)
    let totalIncome = 0;
    projects.forEach((project) => {
      if (project.status === "completed") {
        // Convert to selected currency if needed
        if (project.currency === currency) {
          totalIncome += project.price;
        } else {
          // Simple conversion for demo (1 USD = 320 LKR)
          if (project.currency === "USD" && currency === "LKR") {
            totalIncome += project.price * 320;
          } else if (project.currency === "LKR" && currency === "USD") {
            totalIncome += project.price / 320;
          }
        }
      }
    });
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      overdueProjects,
      totalIncome,
    };
  }, [projects, currency]);
  
  // Filter projects for the recent projects list
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [projects, searchQuery]);
  
  // Generate chart data
  const statusChartData = useMemo(() => generateStatusChartData(projects), [projects]);
  const incomeChartData = useMemo(() => generateMonthlyIncomeData(projects, currency), [projects, currency]);
  
  const handleAddProject = () => {
    router.push("/modal/add-project");
  };
  
  const renderProjectItem = ({ item }: { item: typeof projects[0] }) => {
    const client = clients.find((c) => c.id === item.clientId);
    return <ProjectCard project={item} client={client} />;
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <CurrencySelector />
      </View>
      
      <View style={[styles.statsContainer, isTablet && styles.statsContainerTablet]}>
        <StatCard
          title="Total Projects"
          value={stats.totalProjects.toString()}
          icon={<Briefcase size={20} color={COLORS.accent} />}
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          icon={<Clock size={20} color={COLORS.accent} />}
        />
        <StatCard
          title="Completed"
          value={stats.completedProjects.toString()}
          icon={<CheckCircle size={20} color={COLORS.accent} />}
        />
        <StatCard
          title="Overdue"
          value={stats.overdueProjects.toString()}
          icon={<AlertTriangle size={20} color={COLORS.accent} />}
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome, currency)}
          icon={<DollarSign size={20} color={COLORS.accent} />}
          style={isTablet ? { flex: 2 } : undefined}
        />
      </View>
      
      <View style={[styles.chartsContainer, isTablet && styles.chartsContainerTablet]}>
        <View style={[styles.chartWrapper, isTablet && styles.chartWrapperTablet]}>
          <Chart
            type="pie"
            data={statusChartData}
            title="Project Status"
          />
        </View>
        
        <View style={[styles.chartWrapper, isTablet && styles.chartWrapperTablet]}>
          <Chart
            type="line"
            data={incomeChartData}
            title="Monthly Income"
          />
        </View>
      </View>
      
      <View style={styles.recentProjectsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <Button
            title="Add Project"
            size="small"
            icon={<Plus size={16} color={COLORS.textPrimary} />}
            onPress={handleAddProject}
          />
        </View>
        
        <SearchBar
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        {filteredProjects.length > 0 ? (
          <FlatList
            data={filteredProjects}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <EmptyState
            title="No projects found"
            description={
              searchQuery
                ? "Try a different search term"
                : "Add your first project to get started"
            }
            icon={<Briefcase size={40} color={COLORS.textSecondary} />}
            actionLabel="Add Project"
            onAction={handleAddProject}
          />
        )}
      </View>
    </ScrollView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statsContainerTablet: {
    flexWrap: "nowrap",
  },
  chartsContainer: {
    marginBottom: SPACING.md,
  },
  chartsContainerTablet: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  chartWrapper: {
    marginBottom: SPACING.md,
  },
  chartWrapperTablet: {
    flex: 1,
  },
  recentProjectsContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});