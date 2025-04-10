import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Pressable,
  ActionSheetIOS,
  Platform,
} from "react-native";

import Camera from "@/assets/icons/Camera";
import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { router } from "expo-router";
import axios from "axios";

// Import default image
import alumniPlaceholder from "@/assets/images/alumni.jpg";

const AlumniSignup = () => {
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const fullNameRef = useRef("");
  const batchRef = useRef("");
  const currWorkRef = useRef("");
  const positionRef = useRef("");
  const bioRef = useRef("");

  const [profilePic, setProfilePic] = useState(alumniPlaceholder);
  const [loading, setLoading] = useState(false);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const openImagePickerOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Gallery"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto();
          else if (buttonIndex === 2) pickFromGallery();
        }
      );
    } else {
      Alert.alert("Upload Photo", "Choose an option", [
        { text: "Camera", onPress: takePhoto },
        { text: "Gallery", onPress: pickFromGallery },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleSignup = async () => {
    if (
      !usernameRef.current ||
      !emailRef.current ||
      !passwordRef.current ||
      !fullNameRef.current ||
      !batchRef.current ||
      !currWorkRef.current ||
      !positionRef.current ||
      !bioRef.current
    ) {
      Alert.alert("Signup Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      let formData = new FormData();

      formData.append("username", usernameRef.current?.trim() || "");
      formData.append("email", emailRef.current?.trim() || "");
      formData.append("password", passwordRef.current?.trim() || "");
      formData.append("full_name", fullNameRef.current?.trim() || "");
      formData.append("batch", batchRef.current ? Number(batchRef.current) : 0);
      formData.append("curr_work", currWorkRef.current?.trim() || "");
      formData.append("position", positionRef.current?.trim() || "");
      formData.append("bio", bioRef.current?.trim() || "");

      // Handle profile picture
      if (typeof profilePic === "string" && profilePic.startsWith("file://")) {
        const fileType = profilePic.split(".").pop();
        formData.append("profile_pic", {
          uri: profilePic,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      console.log("🚀 Alumni Signup Request Data:", formData); // Debugging log

      const response = await axios.post(
        "http://192.168.0.140:5000/api/signup/alumni",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully");
        router.push("/login");
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />
        <Text style={styles.header}>Alumni Signup</Text>

        {/* Profile Image Upload */}
        <View style={styles.imagePickerContainer}>
          <Pressable
            style={styles.imageCircle}
            onPress={openImagePickerOptions}
          >
            <Image
              source={
                typeof profilePic === "string"
                  ? { uri: profilePic }
                  : profilePic
              }
              style={styles.image}
            />
          </Pressable>
          <View style={styles.editIcon}>
            <Camera width={20} height={20} />
          </View>
        </View>

        <Input
          placeholder="Username"
          onChangeText={(v) => (usernameRef.current = v)}
        />
        <Input
          placeholder="Email"
          onChangeText={(v) => (emailRef.current = v)}
        />
        <Input
          placeholder="Password"
          onChangeText={(v) => (passwordRef.current = v)}
          secureTextEntry
        />
        <Input
          placeholder="Full Name"
          onChangeText={(v) => (fullNameRef.current = v)}
        />
        <Input
          placeholder="Batch (Year)"
          onChangeText={(v) => (batchRef.current = v)}
          keyboardType="numeric"
        />
        <Input
          placeholder="Current Workplace"
          onChangeText={(v) => (currWorkRef.current = v)}
        />
        <Input
          placeholder="Position"
          onChangeText={(v) => (positionRef.current = v)}
        />
        <Input
          placeholder="Short Bio"
          onChangeText={(v) => (bioRef.current = v)}
          multiline
          numberOfLines={3}
        />

        <View style={{ width: "100%", marginTop: 10 }}>
          <Button title="Sign Up" loading={loading} onPress={handleSignup} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AlumniSignup;

const styles = StyleSheet.create({
  container: {
    padding: wp(5),
    gap: 20,
    alignItems: "center",
  },
  header: {
    fontSize: hp(3.5),
    fontWeight: "bold",
    color: theme.colors.text,
    alignSelf: "flex-start",
  },
  imagePickerContainer: {
    marginVertical: 10,
  },
  imageCircle: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35) / 2,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
    elevation: 5,
    zIndex: 10,
  },
  editIconText: {
    fontSize: 14,
  },
});
