import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Edit, Trash2, FileText, Paperclip, Calendar } from "lucide-react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { formatDate, formatCurrency, getClientNameById } from "@/utils/helpers";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProjectForm from "@/components/projects/ProjectForm";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { projects, clients, deleteProject, updateProject } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const project = useMemo(() => {
    return projects.find((p) => p.id === id);
  }, [projects, id]);
  
  const client = useMemo(() => {
    if (!project) return null;
    return clients.find((c) => c.id === project.clientId);
  }, [project, clients]);
  
  const getStatusVariant = () => {
    if (!project) return "primary";
    
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
    if (!project) return "";
    
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
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (project) {
              deleteProject(project.id);
              router.back();
            }
          },
        },
      ]
    );
  };
  
  const handleUpdate = async (updatedProject: typeof project) => {
    if (!updatedProject) return;
    
    setIsUpdating(true);
    
    try {
      updateProject(updatedProject);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project:", error);
      Alert.alert("Error", "Failed to update project. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (!project) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Project not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }
  
  if (isEditing) {
    return <ProjectForm initialData={project} onSubmit={handleUpdate} isLoading={isUpdating} />;
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{project.title}</Text>
          <Badge label={getStatusLabel()} variant={getStatusVariant()} />
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Edit size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Card>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>
              {client ? client.name : getClientNameById(project.clientId, clients)}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Invoice</Text>
            <Text style={styles.infoValue}>{project.invoiceNumber || "N/A"}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Service Type</Text>
            <Text style={styles.infoValue}>{project.serviceType}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(project.price, project.currency)}
            </Text>
          </View>
        </View>
      </Card>
      
      <Card>
        <View style={styles.sectionHeader}>
          <Calendar size={18} color={COLORS.textSecondary} />
          <Text style={styles.sectionTitle}>Timeline</Text>
        </View>
        
        <View style={styles.timelineItem}>
          <Text style={styles.timelineLabel}>Start Date</Text>
          <Text style={styles.timelineValue}>{formatDate(project.startDate)}</Text>
        </View>
        
        <View style={styles.timelineItem}>
          <Text style={styles.timelineLabel}>Due Date</Text>
          <Text style={styles.timelineValue}>{formatDate(project.dueDate)}</Text>
        </View>
        
        {project.completedDate && (
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Completed Date</Text>
            <Text style={styles.timelineValue}>{formatDate(project.completedDate)}</Text>
          </View>
        )}
      </Card>
      
      <Card>
        <View style={styles.sectionHeader}>
          <FileText size={18} color={COLORS.textSecondary} />
          <Text style={styles.sectionTitle}>Description</Text>
        </View>
        
        <Text style={styles.descriptionText}>{project.description}</Text>
      </Card>
      
      {project.notes && (
        <Card>
          <View style={styles.sectionHeader}>
            <FileText size={18} color={COLORS.textSecondary} />
            <Text style={styles.sectionTitle}>Notes</Text>
          </View>
          
          <Text style={styles.descriptionText}>{project.notes}</Text>
        </Card>
      )}
      
      <Card>
        <View style={styles.sectionHeader}>
          <Paperclip size={18} color={COLORS.textSecondary} />
          <Text style={styles.sectionTitle}>Attachments</Text>
        </View>
        
        {project.attachments.length > 0 ? (
          project.attachments.map((attachment) => (
            <View key={attachment.id} style={styles.attachmentItem}>
              <Text style={styles.attachmentName}>{attachment.name}</Text>
              <Text style={styles.attachmentSize}>
                {(attachment.size / 1000000).toFixed(1)} MB
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No attachments</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
    padding: SPACING.md,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundPrimary,
    padding: SPACING.md,
  },
  notFoundText: {
    fontSize: SIZES.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  backButton: {
    minWidth: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: SIZES.body1,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  timelineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  timelineLabel: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  timelineValue: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  attachmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  attachmentName: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
  },
  attachmentSize: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
});