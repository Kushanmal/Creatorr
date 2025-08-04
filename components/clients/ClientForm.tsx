import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING } from "@/constants/theme";
import { Client } from "@/types";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (client: Client) => void;
  isLoading?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const router = useRouter();
  
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [facebook, setFacebook] = useState(initialData?.socialMedia.facebook || "");
  const [twitter, setTwitter] = useState(initialData?.socialMedia.twitter || "");
  const [instagram, setInstagram] = useState(initialData?.socialMedia.instagram || "");
  const [linkedin, setLinkedin] = useState(initialData?.socialMedia.linkedin || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validate()) return;
    
    const clientData: Client = {
      id: initialData?.id || `client-${Date.now()}`,
      name,
      email,
      phone,
      address,
      company,
      website,
      socialMedia: {
        facebook,
        twitter,
        instagram,
        linkedin,
      },
      notes,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSubmit(clientData);
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
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter client name"
        error={errors.name}
      />
      
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email address"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        error={errors.phone}
      />
      
      <Input
        label="Address"
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        multiline
        numberOfLines={2}
        textAlignVertical="top"
      />
      
      <Input
        label="Company"
        value={company}
        onChangeText={setCompany}
        placeholder="Enter company name"
      />
      
      <Input
        label="Website"
        value={website}
        onChangeText={setWebsite}
        placeholder="Enter website URL"
        keyboardType="url"
        autoCapitalize="none"
      />
      
      <View style={styles.sectionTitle}>
        <Input
          label="Social Media"
          value={facebook}
          onChangeText={setFacebook}
          placeholder="Facebook username"
          autoCapitalize="none"
        />
      </View>
      
      <Input
        value={twitter}
        onChangeText={setTwitter}
        placeholder="Twitter username"
        autoCapitalize="none"
      />
      
      <Input
        value={instagram}
        onChangeText={setInstagram}
        placeholder="Instagram username"
        autoCapitalize="none"
      />
      
      <Input
        value={linkedin}
        onChangeText={setLinkedin}
        placeholder="LinkedIn username"
        autoCapitalize="none"
      />
      
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
          title={initialData ? "Update Client" : "Create Client"}
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
  sectionTitle: {
    marginTop: SPACING.md,
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

export default ClientForm;