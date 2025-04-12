import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
  } from "react-native";
  import React, { useEffect, useState } from "react";
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
  import * as ImagePicker from "expo-image-picker";

  
  const index = (props) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get(
          "http://"+Constants.expoConfig.extra.baseurl+"/api/profile",
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
    useEffect(() => {
        fetchUser();    
    }, []);
    // const { user: currentUser, setUserData } = useAuth();
    // const [user, setUser] = useState({
    //   name: "",
    //   phoneNumber: "",
    //   bio: "",
    //   address: "",
    //   image: ""
    // });
    // const [loading, setLoading] = useState(false);
  
    // useEffect(() => {
    //   if (currentUser) {
    //     setUser({
    //       name: currentUser.name,
    //       phoneNumber: currentUser.phoneNumber,
    //       bio: currentUser.bio,
    //       address: currentUser.address,
    //       image: currentUser.image
    //     });
    //   }
    // }, []);
  
    // const pickImage = async () => {
    //   let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ["images"],
    //     allowsEditing: true,
    //     aspect: [4, 3],
    //     quality: 0.7
    //   });
  
    //   if (!result.canceled) {
    //     setUser({ ...user, image: result.assets[0] });
    //   }
    // };
  
    // const onSubmit = async () => {
    //   let userData = { ...user };
    //   let { address, bio, image, name, phoneNumber } = userData;
  
    //   if (!name || !phoneNumber || !address || !bio || !image) {
    //     Alert.alert("Error", "Please fill all the fields");
    //     return;
    //   }
  
    //   setLoading(true);
  
    //   try {
    //     if (typeof image === "object" && image?.uri) {
    //       let imageRes = await updloadFile("profiles", image.uri, true);
  
    //       if (imageRes.success) {
    //         userData.image = imageRes.data; // ✅ Update userData with the new image URL
    //         setUser({
    //           ...user,
    //           image: imageRes.data
    //         });
    //       } else {
    //         throw new Error("Image upload failed");
    //       }
    //     }
  
    //     const { success, msg } = await updateUser(currentUser?.id, userData);
  
    //     if (success) {
    //       setUserData({ ...userData, image: getSupabaseFileUrl(userData.image) });
    //       router.back();
    //     } else {
    //       Alert.alert("Update Failed", msg || "Something went wrong!");
    //     }
    //   } catch (error) {
    //     Alert.alert("Error", error?.message || "Something went wrong!");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
  
    // const USER_IMAGE1 =
    //   typeof user.image === "string"
    //     ? { uri: user.image }
    //     : user.image
    //     ? user.image
    //     : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjDGMp734S91sDuUFqL51_xRTXS15iiRoHew&s";
  
    return (
      <ScreenWrapper bg={"white"}>
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }}>
            <Header title={"Edit Profile"} />
  
            {/* Form! */}
            <View style={styles.form}>
              <View style={styles.avatarContainer}>
                <Image source={user.profile_pic} style={styles.avatar} />
                <Pressable style={styles.cameraIcon} 
                // onPress={pickImage}
                >
                  <Icon name={"camera"} size={20} strokeWidth={2.5} />
                </Pressable>
              </View>
  
              <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                Please fill your profile details
              </Text>
              <Input
                icon={<Icon name={"user"} />}
                placeholder="Enter your name"
                value={user.name}
                // onChangeText={(text) => {
                //   setUser({ ...user, name: text });
                // }}
              />
              <Input
                icon={<Icon name={"call"} />}
                placeholder="Enter your phone number"
                value={user.phoneNumber}
                // onChangeText={(text) => {
                //   setUser({ ...user, phoneNumber: text });
                // }}
              />
              <Input
                icon={<Icon name={"location"} />}
                placeholder="Enter your address"
                value={user.address}
                // onChangeText={(text) => {
                //   setUser({ ...user, address: text });
                // }}
              />
              <Input
                placeholder="Enter your bio"
                multiline
                value={user.bio}
                // onChangeText={(text) => {
                //   setUser({ ...user, bio: text });
                // }}
                containerStyles={styles.bio}
              />
  
              <Button title="Update" loading={loading} 
            //   onPress={onSubmit} 
              />
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
      paddingVertical: 15
    },
    input: {
      flexDirection: "row",
      gap: 15,
      paddingHorizontal: 20,
      padding: 17,
      borderWidth: 0.4,
      borderColor: theme.colors.text,
      borderRadius: theme.radius.xxl,
      borderCurve: "continuous"
    },
    form: {
      gap: 18,
      marginTop: 20
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
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: theme.radius.xxl * 1.8,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: theme.colors.darkLight
    },
    avatarContainer: {
      height: hp(14),
      width: hp(14),
      alignSelf: "center"
    },
    container: {
      flex: 1,
      paddingHorizontal: wp(4)
    }
  });