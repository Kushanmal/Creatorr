import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Users } from "lucide-react-native";
import { COLORS, SPACING, SIZES } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import ClientCard from "@/components/dashboard/ClientCard";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default function ClientsScreen() {
  const router = useRouter();
  const { clients, projects, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter clients
  const filteredClients = useMemo(() => {
    return clients
      .filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, searchQuery]);
  
  // Count projects per client
  const getProjectCount = (clientId: string) => {
    return projects.filter((project) => project.clientId === clientId).length;
  };
  
  const handleAddClient = () => {
    router.push("/modal/add-client");
  };
  
  const renderClientItem = ({ item }: { item: typeof clients[0] }) => {
    const projectCount = getProjectCount(item.id);
    return <ClientCard client={item} projectCount={projectCount} />;
  };
  
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
        <Text style={styles.headerTitle}>Clients</Text>
        <Button
          title="Add Client"
          size="small"
          icon={<Plus size={16} color={COLORS.textPrimary} />}
          onPress={handleAddClient}
        />
      </View>
      
      <SearchBar
        placeholder="Search clients..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {filteredClients.length > 0 ? (
        <FlatList
          data={filteredClients}
          renderItem={renderClientItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          title="No clients found"
          description={
            searchQuery
              ? "Try a different search term"
              : "Add your first client to get started"
          }
          icon={<Users size={40} color={COLORS.textSecondary} />}
          actionLabel="Add Client"
          onAction={handleAddClient}
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
  listContent: {
    paddingBottom: SPACING.xl,
  },
});