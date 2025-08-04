import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Filter } from "lucide-react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { ProjectStatus, ServiceType } from "@/types";
import { useApp } from "@/context/AppContext";
import ProjectCard from "@/components/dashboard/ProjectCard";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects, clients, isLoading } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique service types from projects
  const serviceTypes = useMemo(() => {
    const types = new Set<ServiceType>();
    projects.forEach((project) => {
      types.add(project.serviceType);
    });
    return Array.from(types);
  }, [projects]);
  
  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((project) =>
        statusFilter === "all" ? true : project.status === statusFilter
      )
      .filter((project) =>
        serviceTypeFilter === "all" ? true : project.serviceType === serviceTypeFilter
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [projects, searchQuery, statusFilter, serviceTypeFilter]);
  
  const handleAddProject = () => {
    router.push("/modal/add-project");
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearFilters = () => {
    setStatusFilter("all");
    setServiceTypeFilter("all");
  };
  
  const renderProjectItem = ({ item }: { item: typeof projects[0] }) => {
    const client = clients.find((c) => c.id === item.clientId);
    return <ProjectCard project={item} client={client} />;
  };
  
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
    { label: "Overdue", value: "overdue" },
  ];
  
  const serviceTypeOptions = [
    { label: "All Service Types", value: "all" },
    ...serviceTypes.map((type) => ({ label: type, value: type })),
  ];
  
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
        <Text style={styles.headerTitle}>Projects</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleFilters}
          >
            <Filter size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Button
            title="Add Project"
            size="small"
            icon={<Plus size={16} color={COLORS.textPrimary} />}
            onPress={handleAddProject}
          />
        </View>
      </View>
      
      <SearchBar
        placeholder="Search projects..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Select
                label="Status"
                options={statusOptions}
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as any)}
              />
            </View>
            
            <View style={styles.filterItem}>
              <Select
                label="Service Type"
                options={serviceTypeOptions}
                value={serviceTypeFilter}
                onValueChange={(value) => setServiceTypeFilter(value as any)}
              />
            </View>
          </View>
          
          <Button
            title="Clear Filters"
            variant="outline"
            size="small"
            onPress={clearFilters}
            style={styles.clearButton}
          />
        </View>
      )}
      
      {filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          title="No projects found"
          description={
            searchQuery || statusFilter !== "all" || serviceTypeFilter !== "all"
              ? "Try different filters or search terms"
              : "Add your first project to get started"
          }
          icon={<Plus size={40} color={COLORS.textSecondary} />}
          actionLabel="Add Project"
          onAction={handleAddProject}
        />
      )}
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  filtersContainer: {
    marginBottom: SPACING.md,
  },
  filterRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  filterItem: {
    flex: 1,
  },
  clearButton: {
    alignSelf: "flex-end",
    marginTop: SPACING.xs,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});