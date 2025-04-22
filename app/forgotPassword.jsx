import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
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
const forgotPassword = ({ role }) => {
  const newPassRef = useRef("");
  const cnfrmPassRef = useRef("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleUpdate = async () => {
    if (!newPassRef.current || !cnfrmPassRef.current) {
      Alert.alert("Update Password", "Please fill all details");
      return;
    }

    if (newPassRef.current !== cnfrmPassRef.current) {
      Alert.alert("Update Password", "Passwords do not match");
      return;
    }
    const password = newPassRef.current.trim();

    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.post(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/updatePass",
        {
          role,
          password,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        Alert.alert(
          "Password Updated",
          "Your password has been updated successfully."
        );
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
      } else {
        Alert.alert(
          "Login Failed",
          response.data.message || "Invalid credentials"
        );
      }
    } catch (err) {
      Alert.alert(
        "Login Error",
        "An unexpected error occurred. Please try again."
      );
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle={"dark-content"} />

      <View style={styles.container}>
        <BackButton />

        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>Set up your Password</Text>
        </View>

        {/* form! */}
        <View style={styles.form}>
          <Text
            style={{
              fontSize: hp(1.5),
              color: theme.colors.text,
            }}
          >
            Please choose a strong password
          </Text>

          <Input
            placeholder={"Enter a new password"}
            onChangeText={(value) => {
              newPassRef.current = value;
            }}
            secureTextEntry
          />
          <Input
            placeholder={"Confirm your password"}
            onChangeText={(value) => {
              cnfrmPassRef.current = value;
            }}
          />
          <Button title="Update" loading={loading} onPress={handleUpdate} />
        </View>

        {/* footer! */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>

          <Pressable onPress={() => router.push("/signUp")}>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.primaryDark, fontWeight: "700" }
              ]}
            >
              Sign up
            </Text>
          </Pressable>
        </View> */}
      </View>
    </ScreenWrapper>
  );
};

export default forgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  form: {
    marginTop: hp(3),
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "700",
    color: theme.colors.text,
  },
  // footer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   gap: 5
  // },
  // footerText: {
  //   textAlign: "center",
  //   color: theme.colors.text,
  //   fontSize: hp(1.6)
  // }
});
