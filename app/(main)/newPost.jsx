import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "@/components/Avatar";
//   import { useAuth } from "@/context/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import { Icon } from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Image } from "expo-image";
//   import { getSupabaseFileUrl } from "@/services/image.service";
//   import { createOrUpdatePost } from "@/services/post.service";
import { router } from "expo-router";

export default function index() {
  const [user, setUser] = useState({});
  const fetchUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log("Retrieved Token:", token);

      if (!token) throw new Error("No token found");

      const response = await axios.get(
        "http://192.168.0.140:5000/api/profile",
        {
          headers: { token: `${token}` },
        }
      );

      console.log("User data fetched successfully:", response.data.info);
      setUser(response.data.info);
    } catch (error) {
      console.error("Failed to fetch user:", error.message);
    }
  };

  // const post = useLocalSearchParams();

  const bodyRef = useRef(null);
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // console.log({ file });

  useEffect(() => {
    fetchUser();
  }, []);

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("Post", "Please choose an image or add post body");
      return;
    }

    const token = await SecureStore.getItemAsync("token");
    let formdata = new FormData();
    formdata.append("file", {
      uri: file.uri,
      type: file.mimeType || "image/jpeg", // Provide a default type
      name: file.fileName || `image_${Date.now()}.jpg`, // Ensure a filename
    });
    formdata.append("body", bodyRef.current);

    console.log(file.uri, file.mimeType, file.fileName);

    setLoading(true);
    let res = await axios.post("http://192.168.0.140:5000/api/post", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `${token}`,
      },
    });
    setLoading(false);
    if (res.data.success) {
      // clear!
      setFile(null);
      bodyRef.current = "";
      editorRef?.current?.setContentHTML("");
      router.back();
      Alert.alert("Post", "Post created successfully");
    } else {
      Alert.alert("Post", "Failed to create post");
    }
    console.log({ res });
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <Header title={"Create Post"} />

        <ScrollView
          contentContainerStyle={{ gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* avatar! */}
          <View style={styles.header}>
            <Avatar uri={null} size={hp(6.5)} rounded={theme.radius.xl} />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user.full_name}</Text>
              <Text style={styles.publicText}>@{user.username}</Text>
            </View>
          </View>

          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>

          {file && (
            <View style={styles.file}>
              <Image
                source={{ uri: file?.uri }} // Fix: Access 'uri' property of the file
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }} // Fix: Ensure the image is visible
              />

              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name="delete" color={"white"} size={20} />
              </Pressable>
            </View>
          )}

          {!file && (
            <View style={styles.media}>
              <Text style={styles.addImageText}>Add to your post</Text>
              <View style={styles.mediaIcons}>
                <TouchableOpacity style={{}} onPress={() => onPick(true)}>
                  <Icon name={"image"} size={30} color={theme.colors.dark} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <Button
          buttonStyle={{
            height: hp(6.2),
          }}
          title={"Post"}
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: "600",
    color: theme.colors.text,
  },
  avatar: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: theme.radius.xl,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderCurve: "continuous",
  },
  textEditor: {},
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  header: {
    gap: 12,
    alignItems: "center",
    flexDirection: "row",
  },
  publicText: {
    fontSize: hp(1.5),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
  addImageText: {
    fontSize: hp(1.9),
    color: theme.colors.text,
    fontWeight: "600",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,0,0,0.6)",
    padding: 7,
    borderRadius: 50,
  },
});
