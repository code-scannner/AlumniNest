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

import { Icon } from "@/assets/icons";
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
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

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
        "http://" + Constants.expoConfig.extra.baseurl + "/api/signup/alumni",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully");
        await SecureStore.setItemAsync("token", response.data.token);
        router.push("/(main)/home");
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
          <View style={styles.avatarContainer}>
            <Image
              source={
                typeof profilePic === "string"
                  ? { uri: profilePic }
                  : profilePic
              }
              style={styles.avatar}
            />
          </View>
          <Pressable onPress={openImagePickerOptions}>
            <View style={styles.cameraIcon}>
              <Icon name={"camera"} size={20} strokeWidth={2.5} />
            </View>
          </Pressable>
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
          // numberOfLines={3}
          containerStyles={styles.bio}
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
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
  },
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
  cameraIcon: {
    elevation: 7,
    shadowRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
});
