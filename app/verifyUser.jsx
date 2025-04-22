import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import Dropdown from "@/components/Dropdown";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Input from "@/components/Input";
import { Icon } from "@/assets/icons";
import Button from "@/components/Button";
import { router } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";

const verifyUser = () => {
  const emailRef = useRef("");
  const [loading, setLoading] = useState(false);
  const roleOptions = ["Alumni", "Student"];
  const [selectedRole, setSelectedRole] = useState("");
  const roleRef = useRef("");

  const handleVerify = async () => {
    if (!emailRef.current || !roleRef.current) {
      Alert.alert("Verify User", "Please fill all details");
      return;
    }

    const email = emailRef.current.trim();
    const role = roleRef.current.trim();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/forgot",
        {
          email,
          role,
        }
      );

      if (response.data.success) {
        router.push({
          pathname: "/verifyOtp",
          params: {
            email: email,
            role: role,
            type: "forgot",
          },
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
          <Text style={styles.welcomeText}>Verify your Identity</Text>
        </View>

        {/* form! */}
        <View style={styles.form}>
          <Text
            style={{
              fontSize: hp(1.5),
              color: theme.colors.text,
            }}
          >
            Please verify to update your password
          </Text>

          <Input
            placeholder={"Enter your registered email"}
            onChangeText={(value) => {
              emailRef.current = value;
            }}
          />
          <Dropdown
            placeholder="Select Role"
            data={roleOptions}
            selected={selectedRole}
            onSelect={(v) => {
              setSelectedRole(v);
              roleRef.current = v;
            }}
          />

          <Button title="Get OTP" loading={loading} onPress={handleVerify} />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default verifyUser;

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
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "700",
    color: theme.colors.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
