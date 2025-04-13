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
import Dropdown from "@/components/Dropdown";
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
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import studentPlaceholder from "@/assets/images/student.jpg";

const StudentSignup = () => {
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const fullNameRef = useRef("");
  const passoutYearRef = useRef("");
  const phoneNoRef = useRef("");
  const courseRef = useRef("");
  const branchRef = useRef("");
  const collegeRef = useRef("");
  const bioRef = useRef("");
  const courseOptions = ["B.Tech", "M.Tech", "PhD"];
  const branchOptions = ["CSE", "ECE", "EE", "ME", "CE", "Other"];

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [profilePic, setProfilePic] = useState(studentPlaceholder);
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
      setProfilePic(result.assets[0]);
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
      !passoutYearRef.current ||
      !phoneNoRef.current ||
      !courseRef.current ||
      !branchRef.current ||
      !collegeRef.current ||
      !bioRef.current
    ) {
      Alert.alert("Signup Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      let formData = new FormData();

      formData.append("username", usernameRef.current.trim());
      formData.append("email", emailRef.current.trim());
      formData.append("password", passwordRef.current.trim());
      formData.append("full_name", fullNameRef.current.trim());
      formData.append("passout_year", Number(passoutYearRef.current));
      formData.append("phone_no", Number(phoneNoRef.current));
      formData.append("course", courseRef.current.trim());
      formData.append("branch", branchRef.current.trim());
      formData.append("college", collegeRef.current.trim());
      formData.append("bio", bioRef.current.trim());

      if (profilePic && profilePic !== studentPlaceholder) {
        formData.append("file", {
          uri: profilePic.uri,
          type: profilePic.mimeType || "image/jpeg", // Provide a default type
          name: profilePic.fileName || `image_${Date.now()}.jpg`, // Ensure a filename
        });
      }

      console.log("Signup Request FormData:", formData);

      const response = await axios.post(
        "http://"+Constants.expoConfig.extra.baseurl+"/api/signup/student",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
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
        <Text style={styles.header}>Student Signup</Text>

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
          placeholder="Username "
          onChangeText={(v) => (usernameRef.current = v)}
        />
        <Input
          placeholder="Email "
          onChangeText={(v) => (emailRef.current = v)}
        />
        <Input
          placeholder="Password "
          onChangeText={(v) => (passwordRef.current = v)}
          secureTextEntry
        />
        <Input
          placeholder="Full Name "
          onChangeText={(v) => (fullNameRef.current = v)}
        />
        <Input
          placeholder="Passout Year "
          onChangeText={(v) => (passoutYearRef.current = v)}
          keyboardType="numeric"
        />
        <Input
          placeholder="Phone Number "
          onChangeText={(v) => (phoneNoRef.current = v)}
          keyboardType="numeric"
        />
        {/* <Input placeholder="Course (Btech/Mtech) *" onChangeText={(v) => (courseRef.current = v)} /> */}
        <Dropdown
          placeholder="Select Course "
          data={courseOptions}
          selected={selectedCourse}
          onSelect={(v) => {
            setSelectedCourse(v);
            courseRef.current = v;
          }}
        />

        <Dropdown
          placeholder="Select Branch "
          data={branchOptions}
          selected={selectedBranch}
          onSelect={(v) => {
            setSelectedBranch(v);
            branchRef.current = v;
          }}
        />
        <Input
          placeholder="College "
          onChangeText={(v) => (collegeRef.current = v)}
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

export default StudentSignup;

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
      height: 4
    },
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center"
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth:2,
    borderColor: theme.colors.primary
  }
});
