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
import { Image } from "react-native";
import { Icon } from "@/assets/icons";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";

const AlumniEdit = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState();

  const usernameRef = useRef("");
  const emailRef = useRef("");
  const fullNameRef = useRef("");
  const batchRef = useRef("");
  const currWorkRef = useRef("");
  const positionRef = useRef("");
  const bioRef = useRef("");

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
      setProfilePic(
        fetchedUser.profile_pic
          ? { uri: fetchedUser.profile_pic }
          : require("@/assets/images/alumni.jpg")
      );

      usernameRef.current = fetchedUser.username || "";
      emailRef.current = fetchedUser.email || "";
      fullNameRef.current = fetchedUser.full_name || "";
      batchRef.current = fetchedUser.batch || "";
      currWorkRef.current = fetchedUser.curr_work || "";
      positionRef.current = fetchedUser.position || "";
      bioRef.current = fetchedUser.bio || "";
    } catch (error) {
      console.error("Error fetching alumni:", error.message);
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

  const onSubmit = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("username", usernameRef.current?.trim?.());
      formData.append("email", emailRef.current?.trim?.());
      formData.append("full_name", fullNameRef.current?.trim?.());
      formData.append("batch",( batchRef.current?.trim?.()||''));
      formData.append("curr_work", currWorkRef.current?.trim?.());
      formData.append("position", positionRef.current?.trim?.());
      formData.append("bio", bioRef.current?.trim?.());

      if (profilePic?.uri) {
        formData.append("file", {
          uri: profilePic.uri,
          type: profilePic.mimeType || "image/jpeg",
          name: profilePic.fileName || `image_${Date.now()}.jpg`,
        });
      }

      const token = await SecureStore.getItemAsync("token");
      const response = await axios.put(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/profile/alumni",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data", token },
        }
      );
      console.log(response);
      

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully");
        router.push("/(main)/profile");
      } else {
        Alert.alert("Error", response.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
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
              <Image source={profilePic} style={styles.avatar} />
              <Pressable
                style={styles.cameraIcon}
                onPress={openImagePickerOptions}
              >
                <Icon name={"camera"} size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Update your alumni profile
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
              placeholder="Batch"
              defaultValue={user.batch?.toString() || ""}
              onChangeText={(v) => (batchRef.current = v)}
              keyboardType="numeric"
            />
            <Input
              placeholder="Current Work"
              defaultValue={user.curr_work || ""}
              onChangeText={(v) => (currWorkRef.current = v)}
            />
            <Input
              placeholder="Position"
              defaultValue={user.position || ""}
              onChangeText={(v) => (positionRef.current = v)}
            />
            <Input
              placeholder="Short Bio"
              defaultValue={user.bio || ""}
              onChangeText={(v) => (bioRef.current = v)}
              multiline
              // numberOfLines={3}
              containerStyles={styles.bio}
            />
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default AlumniEdit;

const styles = StyleSheet.create({
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  cameraIcon: {
    elevation: 7,
    shadowRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
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
});
