import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { router } from "expo-router";

// Adjust the path if needed
const alumniImg = require("@/assets/images/alumni.png");
const studentImg = require("@/assets/images/student.png");

const signUp = () => {
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar barStyle={"dark-content"} />

      <View style={styles.container}>
        <BackButton />

        {/* Header */}
        <View>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
          {/* <Text style={styles.subtitle}>Continue as:</Text> */}
        </View>

        {/* Column Options */}
        <View style={styles.optionContainer}>
          {/* Alumni Option */}
          <Pressable
            style={styles.optionBox}
            onPress={() => router.push("/alumniSignup")}
          >
            <View style={[styles.iconBox, { borderColor: theme.colors.primaryDark, borderWidth: 1 }]}>
              <Image
                source={alumniImg}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.primaryDark,fontSize:15},
              ]}
            >
              Alumni
            </Text>
          </Pressable>

          {/* Student Option */}
          <Pressable
            style={styles.optionBox}
            onPress={() => router.push("/studentSignup")}
          >
            <View style={[styles.iconBox, { borderColor: theme.colors.primaryDark, borderWidth: 1 }]}>
              <Image
                source={studentImg}
                style={styles.iconImage}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.primaryDark,fontSize:15},
              ]}
            >
              Student
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.primaryDark, fontWeight: "700" },
              ]}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default signUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: hp(2),
    color: theme.colors.text,
    marginTop: 5,
  },
  optionContainer: {
    marginTop: hp(4),
    alignItems: "center",
    gap: hp(4),
  },
  optionBox: {
    alignItems: "center",
    gap: hp(1),
  },
  iconBox: {
    width: wp(30),
    height: wp(30),
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconImage: {
    width: "70%",
    height: "70%",
  },
  optionLabel: {
    fontSize: hp(2.2),
    fontWeight: "600",
    color: theme.colors.text,
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