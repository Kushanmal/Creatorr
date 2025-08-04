import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Edit, Trash2, Mail, Phone, Globe, MapPin, Briefcase, Facebook, Twitter, Instagram, Linkedin } from "lucide-react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ClientForm from "@/components/clients/ClientForm";

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { clients, projects, deleteClient, updateClient } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const client = useMemo(() => {
    return clients.find((c) => c.id === id);
  }, [clients, id]);
  
  const clientProjects = useMemo(() => {
    if (!client) return [];
    return projects.filter((p) => p.clientId === client.id);
  }, [client, projects]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Client",
      "Are you sure you want to delete this client? This will not delete associated projects.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (client) {
              deleteClient(client.id);
              router.back();
            }
          },
        },
      ]
    );
  };
  
  const handleUpdate = async (updatedClient: typeof client) => {
    if (!updatedClient) return;
    
    setIsUpdating(true);
    
    try {
      updateClient(updatedClient);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating client:", error);
      Alert.alert("Error", "Failed to update client. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleContact = (type: "email" | "phone" | "website") => {
    if (!client) return;
    
    switch (type) {
      case "email":
        Linking.openURL(`mailto:${client.email}`);
        break;
      case "phone":
        Linking.openURL(`tel:${client.phone}`);
        break;
      case "website":
        if (client.website) {
          Linking.openURL(client.website.startsWith("http") ? client.website : `https://${client.website}`);
        }
        break;
    }
  };
  
  const handleSocialMedia = (platform: keyof typeof client.socialMedia) => {
    if (!client?.socialMedia[platform]) return;
    
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://facebook.com/${client.socialMedia.facebook}`;
        break;
      case "twitter":
        url = `https://twitter.com/${client.socialMedia.twitter}`;
        break;
      case "instagram":
        url = `https://instagram.com/${client.socialMedia.instagram}`;
        break;
      case "linkedin":
        url = `https://linkedin.com/in/${client.socialMedia.linkedin}`;
        break;
    }
    
    if (url) {
      Linking.openURL(url);
    }
  };
  
  if (!client) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Client not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }
  
  if (isEditing) {
    return <ClientForm initialData={client} onSubmit={handleUpdate} isLoading={isUpdating} />;
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{client.name}</Text>
          {client.company && <Text style={styles.company}>{client.company}</Text>}
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
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <Mail size={18} color={COLORS.textSecondary} />
          </View>
          <TouchableOpacity onPress={() => handleContact("email")}>
            <Text style={styles.contactText}>{client.email}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <Phone size={18} color={COLORS.textSecondary} />
          </View>
          <TouchableOpacity onPress={() => handleContact("phone")}>
            <Text style={styles.contactText}>{client.phone}</Text>
          </TouchableOpacity>
        </View>
        
        {client.address && (
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MapPin size={18} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.contactText}>{client.address}</Text>
          </View>
        )}
        
        {client.website && (
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Globe size={18} color={COLORS.textSecondary} />
            </View>
            <TouchableOpacity onPress={() => handleContact("website")}>
              <Text style={styles.contactText}>{client.website}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
      
      {(client.socialMedia.facebook || client.socialMedia.twitter || client.socialMedia.instagram || client.socialMedia.linkedin) && (
        <Card>
          <Text style={styles.sectionTitle}>Social Media</Text>
          
          <View style={styles.socialMediaContainer}>
            {client.socialMedia.facebook && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialMedia("facebook")}
              >
                <Facebook size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            )}
            
            {client.socialMedia.twitter && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialMedia("twitter")}
              >
                <Twitter size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            )}
            
            {client.socialMedia.instagram && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialMedia("instagram")}
              >
                <Instagram size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            )}
            
            {client.socialMedia.linkedin && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialMedia("linkedin")}
              >
                <Linkedin size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            )}
          </View>
        </Card>
      )}
      
      {client.notes && (
        <Card>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{client.notes}</Text>
        </Card>
      )}
      
      <View style={styles.projectsSection}>
        <View style={styles.projectsHeader}>
          <View style={styles.sectionTitleContainer}>
            <Briefcase size={18} color={COLORS.textSecondary} />
            <Text style={styles.sectionTitle}>Projects</Text>
          </View>
          <Text style={styles.projectCount}>{clientProjects.length} projects</Text>
        </View>
        
        {clientProjects.length > 0 ? (
          clientProjects.map((project) => (
            <ProjectCard key={project.id} project={project} client={client} />
          ))
        ) : (
          <Text style={styles.emptyText}>No projects for this client</Text>
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
  company: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  contactIconContainer: {
    width: 30,
  },
  contactText: {
    fontSize: SIZES.body1,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  socialMediaContainer: {
    flexDirection: "row",
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  notesText: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  projectsSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  projectsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectCount: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    padding: SPACING.md,
  },
});