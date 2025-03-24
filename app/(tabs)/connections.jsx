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
            source={require("../../assets/images/photo.jpeg")}
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
        <Text className="text-3xl font-bold italic text-primary-700">
          Utkarsh Trivedi
        </Text>

        {/* Personal Information */}
        <View
          style={styles.infoContainer}
          className="flex-1 justify-center items-center"
        >
          <Text style={styles.bio} className="italic text-primary-200">
            "{res.bio}"
          </Text>
        </View>
        <View
          style={styles.infoContainer}
          className="bg-primary-999 rounded-lg"
        >
          <Text style={styles.sectionTitle} className="text-primary-200">
            Personal Information
          </Text>
          <Text style={styles.infoText} className="text-primary-200">
            <Feather name="user" size={16} /> Username: {res.username}
          </Text>
          <Text style={styles.infoText} className="text-primary-200">
            <Feather name="mail" size={16} /> Email: {res.email}
          </Text>
          <Text style={styles.infoText} className="text-primary-200">
            <Feather name="phone" size={16} /> Phone: {res.phone_no}
          </Text>
          <Text style={styles.infoText} className="text-primary-200">
            <Feather name="book" size={16} /> Course: {res.course}
          </Text>
          <Text style={styles.infoText} className="text-primary-200">
            <Feather name="layers" size={16} /> Branch: {res.branch}
          </Text>
          <Text style={styles.infoText} className="text-primary-200">
            <Feather name="home" size={16} /> College: {res.college}
          </Text>
          <Text style={styles.infoText} className="text-primary-200">
            <Feather name="calendar" size={16} /> Passout Year:{" "}
            {res.passout_year}
          </Text>
        </View>

        {/* Utilities */}
        <View style={styles.utilitiesContainer}>
          <TouchableOpacity
            style={styles.utilityButton}
            className="bg-primary-999"
          >
            <Text className="text-primary-200">
              <Feather name="download" size={20} />
            </Text>
            <Text style={styles.utilityText} className="text-primary-200">
              Downloads
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.utilityButton}
            className="bg-primary-999"
          >
            <Text className="text-primary-200">
              <Feather name="users" size={20} />
            </Text>
            <Text style={styles.utilityText} className="text-primary-200">Connections</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.utilityButton}
            className="bg-primary-999"
          >
            <Text className="text-primary-200">
              <Feather name="help-circle" size={20} />
            </Text>
            <Text style={styles.utilityText} className="text-primary-200">Help Desk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.utilityButton}
            className="bg-primary-999"
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
  bio: {
    font: "italic",
    fontSize: 12,
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
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginVertical: 5,
  },
  utilitiesContainer: {
    width: "90%",
  },
  utilityButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  utilityText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
