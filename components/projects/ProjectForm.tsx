import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { Project, ServiceType, Currency, ProjectStatus } from "@/types";
import { useApp } from "@/context/AppContext";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DatePicker from "../ui/DatePicker";
import Button from "../ui/Button";

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (project: Project) => void;
  isLoading?: boolean;
}

const serviceTypeOptions = [
  { label: "Web Development", value: "Web Development" },
  { label: "Mobile App", value: "Mobile App" },
  { label: "UI/UX Design", value: "UI/UX Design" },
  { label: "Graphic Design", value: "Graphic Design" },
  { label: "Logo Design", value: "Logo Design" },
  { label: "Branding", value: "Branding" },
  { label: "Content Creation", value: "Content Creation" },
  { label: "Other", value: "Other" },
];

const statusOptions = [
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
];

const currencyOptions = [
  { label: "LKR", value: "LKR" },
  { label: "USD", value: "USD" },
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const router = useRouter();
  const { clients } = useApp();
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [clientId, setClientId] = useState(initialData?.clientId || "");
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || "");
  const [serviceType, setServiceType] = useState<ServiceType>(initialData?.serviceType || "Web Development");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [currency, setCurrency] = useState<Currency>(initialData?.currency || "LKR");
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString());
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [completedDate, setCompletedDate] = useState(initialData?.completedDate || "");
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status || "ongoing");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const clientOptions = clients.map((client) => ({
    label: client.name,
    value: client.id,
  }));
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!clientId) {
      newErrors.clientId = "Client is required";
    }
    
    if (!serviceType) {
      newErrors.serviceType = "Service type is required";
    }
    
    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = "Price must be a valid number";
    }
    
    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }
    
    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validate()) return;
    
    const projectData: Project = {
      id: initialData?.id || `project-${Date.now()}`,
      title,
      description,
      notes,
      clientId,
      invoiceNumber,
      serviceType,
      price: Number(price),
      currency,
      startDate,
      dueDate,
      completedDate: status === "completed" ? (completedDate || new Date().toISOString()) : undefined,
      status,
      attachments: initialData?.attachments || [],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSubmit(projectData);
  };
  
  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => router.back() },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <Input
        label="Project Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter project title"
        error={errors.title}
      />
      
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter project description"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      
      <Select
        label="Client"
        options={clientOptions}
        value={clientId}
        onValueChange={setClientId}
        placeholder="Select a client"
        error={errors.clientId}
      />
      
      <Input
        label="Invoice Number"
        value={invoiceNumber}
        onChangeText={setInvoiceNumber}
        placeholder="Enter invoice number"
      />
      
      <Select
        label="Service Type"
        options={serviceTypeOptions}
        value={serviceType}
        onValueChange={(value) => setServiceType(value as ServiceType)}
        error={errors.serviceType}
      />
      
      <View style={styles.row}>
        <View style={styles.priceInput}>
          <Input
            label="Price"
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="numeric"
            error={errors.price}
          />
        </View>
        
        <View style={styles.currencySelect}>
          <Select
            label="Currency"
            options={currencyOptions}
            value={currency}
            onValueChange={(value) => setCurrency(value as Currency)}
          />
        </View>
      </View>
      
      <DatePicker
        label="Start Date"
        value={startDate}
        onValueChange={setStartDate}
        error={errors.startDate}
      />
      
      <DatePicker
        label="Due Date"
        value={dueDate}
        onValueChange={setDueDate}
        error={errors.dueDate}
      />
      
      <Select
        label="Status"
        options={statusOptions}
        value={status}
        onValueChange={(value) => setStatus(value as ProjectStatus)}
      />
      
      {status === "completed" && (
        <DatePicker
          label="Completion Date"
          value={completedDate}
          onValueChange={setCompletedDate}
          placeholder="Select completion date"
        />
      )}
      
      <Input
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter additional notes"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={handleCancel}
          style={styles.cancelButton}
        />
        <Button
          title={initialData ? "Update Project" : "Create Project"}
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundPrimary,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  priceInput: {
    flex: 2,
  },
  currencySelect: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  cancelButton: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  submitButton: {
    flex: 2,
  },
});

export default ProjectForm;