import React from "react";
import { useRouter } from "expo-router";
import { useApp } from "@/context/AppContext";
import ProjectForm from "@/components/projects/ProjectForm";

export default function AddProjectScreen() {
  const router = useRouter();
  const { addProject } = useApp();
  
  const handleSubmit = (project: any) => {
    addProject(project);
    router.back();
  };
  
  return <ProjectForm onSubmit={handleSubmit} />;
}