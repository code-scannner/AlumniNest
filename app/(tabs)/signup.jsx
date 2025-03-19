import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable
} from "react-native";
import { Link, router, useRouter } from "expo-router";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";

export default function Signup() {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    console.log("Signup Data:", { ...formData, role });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.push("/")}>
        <Feather name="arrow-left" size={24} color="white" />
      </Pressable>
      <Text style={styles.title}>
        Alumni <Text style={styles.highlight}>Nest</Text>
      </Text>
      <Text style={styles.textline}>Create a new account</Text>

      <View style={styles.logoContainer}>
        <TouchableOpacity
          onPress={() => {
            setRole("student");
            router.push("pages/student_signup");
          }}
        >
          <Image
            source={require("../../assets/images/student_logo.png")}
            style={[styles.logo, role === "student" && styles.activeLogo]}
          />
          <Text style={styles.logoText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setRole("alumni");
            router.push("pages/alumni_signup");
          }}
          style={styles.logoWrapper}
        >
          <Image
            source={require("../../assets/images/alumni_logo.png")}
            style={[styles.logo, role === "alumni" && styles.activeLogo]}
          />
          <Text style={styles.logoText}>Alumni</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Already have an account?
          <Link href="login">
            <Text style={styles.highlight}> Sign in</Text>
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD", // Light blue background
    padding: 20,
  },
  textline: {
    fontSize: 15,
    marginBottom: 20,
    color: "#1565C0",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#0D47A1", // Deep blue
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
    fontFamily: "Sans",
    textDecorationStyle: "solid",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  highlight: {
    color: "#1565C0", // Medium blue highlight
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    opacity: 0.6,
  },
  activeLogo: {
    opacity: 1,
    borderWidth: 3,
    borderColor: "#0D47A1",
    borderRadius: 15,
  },
  logoText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    color: "#0D47A1", // Deep blue text
  },
  input: {
    width: "80%",
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
  },
  submitButton: {
    width: "80%",
    padding: 12,
    marginTop: 20,
    backgroundColor: "#0D47A1", // Strong blue button
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
