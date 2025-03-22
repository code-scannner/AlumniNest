import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import axios from "axios";
import * as secureStore from "expo-secure-store";

export default function ProfilePage() {
  const router = useRouter();
  const [res, setRes] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await secureStore.getItemAsync("token");
        const response = await axios.get(
          "http://192.168.0.140:5000/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.info;
        setRes(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container} className="bg-primary-dark p-5">
        <Stack.Screen options={{ headerShown: false }} />

        {/* Profile Picture with Edit Icon */}
        <View style={styles.profileWrapper}>
          <Image
            source={require("../../assets/images/student_logo.png")}
            style={styles.profilePic}
          />
        </View>
        <TouchableOpacity
          style={styles.editIconOverlay}
          onPress={() => router.push("/edit-profile")}
        >
          <Feather name="edit" size={20} color="white" />
        </TouchableOpacity>

        {/* Name */}
        <Text className="text-3xl font-bold italic text-primary-600 mb-4">
          {res?.full_name}
        </Text>

        {/* Personal Information */}
        <View
          style={styles.infoContainer}
          className="bg-primary-200 rounded-lg"
        >
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.infoText}>
            <Feather name="user" size={16} /> Username: {res.username}
          </Text>
          <Text style={styles.infoText}>
            <Feather name="mail" size={16} /> Email: {res.email}
          </Text>
          <Text style={styles.infoText}>
            <Feather name="phone" size={16} /> Phone: {res.phone_no}
          </Text>
          <Text style={styles.infoText}>
            <Feather name="book" size={16} /> Course: {res.course}
          </Text>
          <Text style={styles.infoText}>
            <Feather name="layers" size={16} /> Branch: {res.branch}
          </Text>
          <Text style={styles.infoText}>
            <Feather name="home" size={16} /> College: {res.college}
          </Text>
          <Text style={styles.infoText}>
            <Feather name="calendar" size={16} /> Passout Year:{" "}
            {res.passout_year}
          </Text>
        </View>

        {/* Utilities */}
        <View style={styles.utilitiesContainer}>
          <TouchableOpacity style={styles.utilityButton}>
            <Feather name="download" size={20} color="#1565C0" />
            <Text style={styles.utilityText}>Downloads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.utilityButton}>
            <Feather name="users" size={20} color="#1565C0" />
            <Text style={styles.utilityText}>Connections</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.utilityButton}>
            <Feather name="help-circle" size={20} color="#1565C0" />
            <Text style={styles.utilityText}>Help Desk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.utilityButton}
            onPress={() => router.push("/login")}
          >
            <Feather name="log-out" size={20} color="red" />
            <Text style={[styles.utilityText, { color: "red" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  profileWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "hsl(197, 100%, 56%)",
  },
  editIconOverlay: {
    position: "absolute",
    top: 20,
    right: 15,
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  infoContainer: {
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "hsl(210, 80%, 33%)",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#0D47A1",
    marginVertical: 5,
  },
  utilitiesContainer: {
    width: "90%",
  },
  utilityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BBDEFB",
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  utilityText: {
    fontSize: 16,
    color: "#0D47A1",
    marginLeft: 10,
  },
});
