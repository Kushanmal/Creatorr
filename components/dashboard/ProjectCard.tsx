import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { Project, Client } from "@/types";
import { formatDate, formatCurrency } from "@/utils/helpers";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

interface ProjectCardProps {
  project: Project;
  client?: Client;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, client }) => {
  const router = useRouter();
  
  const getStatusVariant = () => {
    switch (project.status) {
      case "completed":
        return "success";
      case "ongoing":
        return "warning";
      case "overdue":
        return "error";
      default:
        return "primary";
    }
  };
  
  const getStatusLabel = () => {
    switch (project.status) {
      case "completed":
        return "Completed";
      case "ongoing":
        return "Ongoing";
      case "overdue":
        return "Overdue";
      default:
        return project.status;
    }
  };
  
  const handlePress = () => {
    router.push(`/project/${project.id}`);
  };
  
  return (
    <TouchableOpacity onPress={handlePress} testID={`project-card-${project.id}`}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {project.title}
          </Text>
          <Badge
            label={getStatusLabel()}
            variant={getStatusVariant()}
          />
        </View>
        
        <View style={styles.clientRow}>
          <Text style={styles.clientLabel}>Client:</Text>
          <Text style={styles.clientName} numberOfLines={1}>
            {client?.name || "Unknown Client"}
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(project.dueDate)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(project.price, project.currency)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  clientRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  clientLabel: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  clientName: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
    flex: 1,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.xs,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
});

export default ProjectCard;