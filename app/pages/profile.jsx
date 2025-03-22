import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import axios from "axios"; // Import axios

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [website, setWebsite] = useState("www.example.com");
  const [location, setLocation] = useState("City, Country");

  const token = await SecureStore.getItemAsync("authToken"); // Get the token from SecureStore

  useEffect(() => {
    const fetchProfile= async () => { 
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container} className="flex-1 justify-center items-center bg-primary-dark p-5">
        <Stack.Screen options={{ headerShown: false }} />
      {/* Profile Picture */}
      <Image source={require("../../assets/images/student_logo.png")} style={styles.profilePic} />
      <Text className="text-3xl font-bold italic text-primary-600 mb-4">Utkarsh Trivedi</Text>
      {/* Personal Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditing(!isEditing)}>
          <Feather name={isEditing ? "save" : "edit"} size={20} color="#1565C0" />
        </TouchableOpacity>
        {isEditing ? (
          <>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} value={website} onChangeText={setWebsite} />
            <TextInput style={styles.input} value={location} onChangeText={setLocation} />
          </>
        ) : (
          <>
            <Text style={styles.infoText}><Feather name="mail" size={16} />  Email: {email}</Text>
            <Text style={styles.infoText}><Feather name="phone" size={16} />  Phone: {phone}</Text>
            <Text style={styles.infoText}><Feather name="globe" size={16} />  Website: {website}</Text>
            <Text style={styles.infoText}><Feather name="map-pin" size={16} />  Location: {location}</Text>
          </>
        )}
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
        <TouchableOpacity style={styles.utilityButton} onPress={() => router.push("/login")}> 
          <Feather name="log-out" size={20} color="red" />
          <Text style={[styles.utilityText, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );rofile = async () => 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'hsl(197, 100%, 56%)',
  },
  infoContainer: {
    backgroundColor: "#BBDEFB",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D47A1",
    marginBottom: 10,
  },
  editIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#0D47A1",
    marginVertical: 5,
  },
  input: {
    fontSize: 14,
    color: "#0D47A1",
    backgroundColor: "white",
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
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