import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";

import { Project, Client, Currency } from "@/types";
import { generateSampleData } from "@/utils/sampleData";

export const [AppProvider, useApp] = createContextHook(() => {
  const [currency, setCurrency] = useState<Currency>("LKR");
  const queryClient = useQueryClient();

  // Load projects
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const storedProjects = await AsyncStorage.getItem("projects");
        if (storedProjects) {
          return JSON.parse(storedProjects) as Project[];
        }
        
        // Initialize with sample data if no data exists
        const sampleData = generateSampleData();
        await AsyncStorage.setItem("projects", JSON.stringify(sampleData.projects));
        return sampleData.projects;
      } catch (error) {
        console.error("Error loading projects:", error);
        return [];
      }
    },
  });

  // Load clients
  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        const storedClients = await AsyncStorage.getItem("clients");
        if (storedClients) {
          return JSON.parse(storedClients) as Client[];
        }
        
        // Initialize with sample data if no data exists
        const sampleData = generateSampleData();
        await AsyncStorage.setItem("clients", JSON.stringify(sampleData.clients));
        return sampleData.clients;
      } catch (error) {
        console.error("Error loading clients:", error);
        return [];
      }
    },
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (newProject: Project) => {
      const projects = [...(projectsQuery.data || []), newProject];
      await AsyncStorage.setItem("projects", JSON.stringify(projects));
      return newProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: Project) => {
      const projects = (projectsQuery.data || []).map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      await AsyncStorage.setItem("projects", JSON.stringify(projects));
      return updatedProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const projects = (projectsQuery.data || []).filter(
        (project) => project.id !== projectId
      );
      await AsyncStorage.setItem("projects", JSON.stringify(projects));
      return projectId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Add client mutation
  const addClientMutation = useMutation({
    mutationFn: async (newClient: Client) => {
      const clients = [...(clientsQuery.data || []), newClient];
      await AsyncStorage.setItem("clients", JSON.stringify(clients));
      return newClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: async (updatedClient: Client) => {
      const clients = (clientsQuery.data || []).map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      );
      await AsyncStorage.setItem("clients", JSON.stringify(clients));
      return updatedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const clients = (clientsQuery.data || []).filter(
        (client) => client.id !== clientId
      );
      await AsyncStorage.setItem("clients", JSON.stringify(clients));
      return clientId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  // Load currency preference
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem("currency");
        if (storedCurrency) {
          setCurrency(storedCurrency as Currency);
        }
      } catch (error) {
        console.error("Error loading currency preference:", error);
      }
    };
    loadCurrency();
  }, []);

  // Save currency preference
  const updateCurrency = async (newCurrency: Currency) => {
    try {
      await AsyncStorage.setItem("currency", newCurrency);
      setCurrency(newCurrency);
    } catch (error) {
      console.error("Error saving currency preference:", error);
    }
  };

  // Currency conversion (simplified for demo)
  const convertCurrency = (amount: number, from: Currency, to: Currency) => {
    // Using a fixed exchange rate for demo purposes
    const exchangeRate = 320; // 1 USD = 320 LKR
    
    if (from === to) return amount;
    
    if (from === "USD" && to === "LKR") {
      return amount * exchangeRate;
    } else {
      return amount / exchangeRate;
    }
  };

  return {
    // State
    currency,
    projects: projectsQuery.data || [],
    clients: clientsQuery.data || [],
    isLoading: projectsQuery.isLoading || clientsQuery.isLoading,
    
    // Actions
    updateCurrency,
    convertCurrency,
    addProject: addProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    addClient: addClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
  };
});