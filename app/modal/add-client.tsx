import React from "react";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import ClientForm from "@/components/clients/ClientForm";

export default function AddClientScreen() {
  const router = useRouter();
  const { addClient } = useApp();
  
  const handleSubmit = (client: any) => {
    addClient(client);
    router.back();
  };
  
  return <ClientForm onSubmit={handleSubmit} />;
}