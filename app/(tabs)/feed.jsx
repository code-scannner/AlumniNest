import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Post from "../../components/Post";
import { Stack } from "expo-router";

const posts = [
  {
    id: 1,
    name: "Alice Johnson",
    bio: "Frontend Dev | Coffee Lover",
    postText: "Just started a new React Native project 🚀",
    postImageUri: "https://via.placeholder.com/300x200",
    additionalText: "Stay tuned for updates!",
  },
  {
    id: 2,
    name: "Bob Smith",
    bio: "Backend Wizard",
    postText: "Server is finally running smooth 😎",
    postImageUri: "",
    additionalText: "Thank you Docker and PM2.",
  },
  {
    id: 3,
    name: "Carla Doe",
    bio: "UI/UX Designer",
    postText: "Designing in Figma all day 🎨",
    postImageUri: "https://via.placeholder.com/300x200",
    additionalText: "Feedback welcome!",
  },
];

const FeedPage = ({ username = "John" }) => {
  return (
    <ScrollView className="flex-1 bg-primary-dark px-5 pt-10">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <View className="flex-row items-center">
          <Image
            source={require("../../assets/images/student_logo.png")}
            style={styles.profilePic}
            className="rounded-full mr-3"
          />
          <Text className="text-white text-lg">
            Hello, <Text className="font-semibold text-primary-400">{username}</Text>
          </Text>
        </View>
        <TouchableOpacity className="p-2 bg-primary-999 rounded-full">
          <Feather name="message-square" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      {/* <View className="border-b border-gray-800 mb-4" /> */}

      {/* Posts */}
      {posts.map((post) => (
        <View key={post.id} className="mb-3 bg-primary-999 p-4 rounded-lg shadow-md">
          <Post
            id={post.id}
            profileImage={require("../../assets/images/student_logo.png")}
            name={post.name}
            bio={post.bio}
            postText={post.postText}
            postImageUri={post.postImageUri}
            additionalText={post.additionalText}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default FeedPage;

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
