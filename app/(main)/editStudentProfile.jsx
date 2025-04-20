import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  ActionSheetIOS,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Header from "@/components/Header";
import { Image } from "expo-image";
import { Icon } from "@/assets/icons";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import Dropdown from "@/components/Dropdown";
import * as ImagePicker from "expo-image-picker";

const index = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const passoutYearRef = useRef("");
  const phoneNoRef = useRef("");
  const courseRef = useRef("");
  const branchRef = useRef("");
  const collegeRef = useRef("");
  const bioRef = useRef("");
  const courseOptions = ["B.Tech", "M.Tech", "PhD"];
  const branchOptions = ["CSE", "ECE", "EE", "ME", "CE", "Other"];
  const [profilePic, setProfilePic] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  const fetchUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.get(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/profile",
        {
          headers: { token: `${token}` },
        }
      );
      const fetchedUser = response.data.info;
      setUser(fetchedUser);

      setSelectedCourse(fetchedUser.course || "");
      setSelectedBranch(fetchedUser.branch || "");

      // Handle profile pic from backend (make sure it's a full URL)
      if (fetchedUser.profile_pic?.startsWith("http")) {
        setProfilePic({ uri: fetchedUser.profile_pic });
      } else if (fetchedUser.profile_pic) {
        setProfilePic({
          uri:
            "http://" +
            Constants.expoConfig.extra.baseurl +
            fetchedUser.profile_pic,
        });
      }

      usernameRef.current = fetchedUser.username || "";
      emailRef.current = fetchedUser.email || "";
      fullNameRef.current = fetchedUser.full_name || "";
      passoutYearRef.current = fetchedUser.passout_year || "";
      phoneNoRef.current = fetchedUser.phone_no || "";
      courseRef.current = fetchedUser.course || "";
      branchRef.current = fetchedUser.branch || "";
      collegeRef.current = fetchedUser.college || "";
      bioRef.current = fetchedUser.bio || "";
    } catch (error) {
      console.error("Failed to fetch user:", error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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

  const onSubmit = async () => {
    setLoading(true);

    try {
      let formData = new FormData();
      formData.append("username", usernameRef.current.trim());
      formData.append("email", emailRef.current.trim());
      formData.append("full_name", fullNameRef.current.trim());
      formData.append("passout_year", Number(passoutYearRef.current));
      formData.append("phone_no", Number(phoneNoRef.current));
      formData.append("course", courseRef.current.trim());
      formData.append("branch", branchRef.current.trim());
      formData.append("college", collegeRef.current.trim());
      formData.append("bio", bioRef.current.trim());

      if (typeof profilePic === "string" && profilePic.startsWith("file://")) {
        const fileType = profilePic.split(".").pop();
        formData.append("file", {
          uri: profilePic,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const token = await SecureStore.getItemAsync("token");
      const response = await axios.put(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/profile/student",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data", token },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully");
        router.back();
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
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title={"Edit Profile"} />

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profilePic?.uri || profilePic }}
                style={styles.avatar}
              />
              <Pressable
                style={styles.cameraIcon}
                onPress={openImagePickerOptions}
              >
                <Icon name={"camera"} size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>

            <Input
              placeholder="Username"
              defaultValue={user.username || ""}
              onChangeText={(v) => (usernameRef.current = v)}
              editable={true}
            />
            <Input
              placeholder="Email"
              defaultValue={user.email || ""}
              onChangeText={(v) => (emailRef.current = v)}
              editable={true}
            />
            <Input
              placeholder="Full Name"
              defaultValue={user.full_name || ""}
              onChangeText={(v) => (fullNameRef.current = v)}
            />
            <Input
              placeholder="Passout Year"
              defaultValue={user.passout_year?.toString() || ""}
              onChangeText={(v) => (passoutYearRef.current = v)}
              keyboardType="numeric"
            />
            <Input
              placeholder="Phone Number"
              defaultValue={user.phone_no?.toString() || ""}
              onChangeText={(v) => (phoneNoRef.current = v)}
              keyboardType="numeric"
            />

            <Dropdown
              placeholder="Select Course"
              data={courseOptions}
              value={user.course}
              selected={selectedCourse}
              onSelect={(v) => {
                setSelectedCourse(v);
                courseRef.current = v;
              }}
            />

            <Dropdown
              placeholder="Select Branch"
              data={branchOptions}
              value={user.branch}
              selected={selectedBranch}
              onSelect={(v) => {
                setSelectedBranch(v);
                branchRef.current = v;
              }}
            />

            <Input
              placeholder="College"
              defaultValue={user.college || ""}
              onChangeText={(v) => (collegeRef.current = v)}
            />
            <Input
              placeholder="Short Bio"
              defaultValue={user.bio || ""}
              onChangeText={(v) => (bioRef.current = v)}
              multiline
              containerStyles={styles.bio}
            />
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  input: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 20,
    padding: 17,
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  form: {
    gap: 18,
    marginTop: 20,
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
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
