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
import * as DocumentPicker from "expo-document-picker";
import { SelectList } from "react-native-dropdown-select-list";
import "../../global.css"

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
  const [branch, setBranch] = useState("Computer Science");
  const [semester, setSemester] = useState("1");
  const [cgpa, setCgpa] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [course, setCourse] = useState("BTech");
  const [resume, setResume] = useState(null);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const branches = ["Computer Science", "Mechanical", "Civil", "Electrical", "ECE", "AIDS", "VLSI"];
  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());
  const courses = ["BTech", "MTech", "MBA", "PhD"];
  const years = Array.from({ length: 20 }, (_, i) => (2005 + i).toString());

  const handleResumeUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.type !== "cancel") {
      setResume(result.uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.push("sign/login")} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#1565C0" />
      </TouchableOpacity>

      <Text style={styles.welcomeTitle}>Sign Up as <Text style={styles.highlightText}>Student</Text></Text>

      {/* Input Fields */}
      <InputField icon="user" placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <InputField icon="envelope" placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <InputField icon="id-card" placeholder="Roll Number" value={rollNumber} onChangeText={setRollNumber} keyboardType="numeric" />
      <InputField icon="mobile" placeholder="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="numeric" />
      <InputField icon="linkedin" placeholder="LinkedIn Profile" value={linkedin} onChangeText={setLinkedin} />
      <InputField icon="book" placeholder="CGPA" value={cgpa} onChangeText={setCgpa} keyboardType="decimal-pad" />

      {/* Dropdowns */}
      <View style={[styles.dropdownContainer, { zIndex: activeDropdown === "branch" ? 3 : 1 }]}>
        <SelectList setSelected={setBranch} data={branches.map((b) => ({ key: b, value: b }))} placeholder="Select Branch" onFocus={() => setActiveDropdown("branch")} onBlur={() => setActiveDropdown(null)} />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: activeDropdown === "semester" ? 2 : 1 }]}>
        <SelectList setSelected={setSemester} data={semesters.map((s) => ({ key: s, value: s }))} placeholder="Select Semester" onFocus={() => setActiveDropdown("semester")} onBlur={() => setActiveDropdown(null)} />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: activeDropdown === "course" ? 2 : 1 }]}>
        <SelectList setSelected={setCourse} data={courses.map((c) => ({ key: c, value: c }))} placeholder="Select Course" onFocus={() => setActiveDropdown("course")} onBlur={() => setActiveDropdown(null)} />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: activeDropdown === "graduationYear" ? 2 : 1 }]}>
        <SelectList setSelected={setGraduationYear} data={years.map((y) => ({ key: y, value: y }))} placeholder="Select Graduation Year" onFocus={() => setActiveDropdown("graduationYear")} onBlur={() => setActiveDropdown(null)} />
      </View>

      {/* Resume Upload */}
      <TouchableOpacity style={styles.button} onPress={handleResumeUpload} >
        <Text style={styles.buttonText}>{resume ? "Resume Uploaded" : "Upload Resume"}</Text>
      </TouchableOpacity>

      {/* Create Account */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
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
