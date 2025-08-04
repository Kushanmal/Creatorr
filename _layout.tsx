import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import { AppProvider } from "@/context/AppContext";
import { COLORS } from "@/constants/theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.backgroundSecondary,
        },
        headerTintColor: COLORS.accent,
        headerTitleStyle: {
          color: COLORS.textPrimary,
        },
        contentStyle: {
          backgroundColor: COLORS.backgroundPrimary,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="project/[id]" 
        options={{ 
          title: "Project Details",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="client/[id]" 
        options={{ 
          title: "Client Details",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="modal/add-project" 
        options={{ 
          title: "Add Project",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="modal/add-client" 
        options={{ 
          title: "Add Client",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <StatusBar style="light" />
          <RootLayoutNav />
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}