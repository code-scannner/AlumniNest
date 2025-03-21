import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function Signup() {
  const [role, setRole] = useState("student");

  return (
    <View className="flex-1 justify-center items-center bg-primary-dark p-5">
      {/* Back Button */}
      <Pressable
        className="absolute top-10 left-5"
        onPress={() => router.push("/")}
      >
        <Feather name="arrow-left" size={24} color="white" />
      </Pressable>

      {/* Title */}
      <Text className="text-5xl font-bold italic text-primary-600 mb-4">
        Alumni <Text className="text-primary-500">Nest</Text>
      </Text>
      <Text className="text-lg text-primary-400 mb-5">
        Create a new account
      </Text>

      {/* Role Selection in a Single Column with Boundary Lines Around Icons */}
      <View className="flex items-center space-y-5">
        <Pressable
          onPress={() => {
            setRole("student");
            router.push("pages/student_signup");
          }}
          className="items-center"
        >
          <View className="border-2 border-primary-500 rounded-lg p-1">
            <Image
              source={require("../../assets/images/student_logo.png")}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
          </View>
          <Text className="text-primary-500 mt-2 mb-10">Student</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setRole("alumni");
            router.push("pages/alumni_signup");
          }}
          className="items-center"
        >
          <View className="border-2 border-primary-500 rounded-lg p-1">
            <Image
              source={require("../../assets/images/alumni_logo.png")}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
          </View>
          <Text className="text-primary-500 mt-2">Alumni</Text>
        </Pressable>
      </View>

      {/* Sign In Link */}
      <Text className="text-white mt-5">
        Already have an account?
        <Link href="login">
          <Text className="text-primary-300"> Sign in</Text>
        </Link>
      </Text>
    </View>
  );
}