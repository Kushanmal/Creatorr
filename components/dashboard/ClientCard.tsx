import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Mail, Phone } from "lucide-react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { Client } from "@/types";
import Card from "../ui/Card";

interface ClientCardProps {
  client: Client;
  projectCount?: number;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, projectCount = 0 }) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/client/${client.id}`);
  };
  
  return (
    <TouchableOpacity onPress={handlePress} testID={`client-card-${client.id}`}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.name}>{client.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{projectCount} Projects</Text>
          </View>
        </View>
        
        {client.company && (
          <Text style={styles.company}>{client.company}</Text>
        )}
        
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Mail size={16} color={COLORS.textSecondary} style={styles.icon} />
            <Text style={styles.contactText} numberOfLines={1}>
              {client.email}
            </Text>
          </View>
          
          <View style={styles.contactItem}>
            <Phone size={16} color={COLORS.textSecondary} style={styles.icon} />
            <Text style={styles.contactText}>{client.phone}</Text>
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
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: SIZES.h4,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  badge: {
    backgroundColor: `${COLORS.accent}20`,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: SIZES.caption,
    fontWeight: "600",
  },
  company: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  contactInfo: {
    marginTop: SPACING.sm,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  contactText: {
    fontSize: SIZES.body2,
    color: COLORS.textPrimary,
    flex: 1,
  },
});

export default ClientCard;