import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";

// Reusable Input Field Component
const InputField = ({ icon, placeholder, value, onChangeText, keyboardType, secureTextEntry }) => (
  <View style={styles.inputContainer}>
    <FontAwesome name={icon} size={20} color="#1565C0" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#555"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const SignupScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity onPress={() => router.push("/signup")} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#1565C0" />
      </TouchableOpacity>

      <Text style={styles.welcomeTitle}>Sign up as <Text style={styles.highlightText}>Alumni</Text></Text>

      {/* Input Fields */}
      <InputField icon="user" placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <InputField icon="envelope" placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <InputField icon="mobile" placeholder="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="numeric" />
      <InputField icon="building" placeholder="Current Company" value={currentCompany} onChangeText={setCurrentCompany} />
      <InputField icon="briefcase" placeholder="Current Role" value={currentRole} onChangeText={setCurrentRole} />
      <InputField icon="linkedin" placeholder="LinkedIn Profile" value={linkedin} onChangeText={setLinkedin} />
      <InputField icon="calendar" placeholder="Batch Year" value={batchYear} onChangeText={setBatchYear} keyboardType="numeric" />


      {/* Create Account */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={()=>router.push("/pages/profile")}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      {/* Footer */}
      <TouchableOpacity onPress={() => router.push("userloginsign/login")}>
        <Text style={styles.bottomText}>Already have an account? <Text style={styles.highlightText}>Sign in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#E3F2FD" },
  backButton: { alignSelf: "flex-start", marginBottom: 20 },
  welcomeTitle: { fontSize: 28, fontWeight: "bold", color: "#0D47A1", marginBottom: 20 },
  highlightText: { color: "#1565C0" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#BBDEFB", paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, width: "100%", marginBottom: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#0D47A1" },
  dropdownContainer: { width: "100%", marginBottom: 15 },
  button: { backgroundColor: "#0D47A1", paddingVertical: 15, borderRadius: 10, width: "100%", alignItems: "center", marginBottom: 15 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  bottomText: { color: "#0D47A1", marginTop: 10 },
});

export default SignupScreen;
