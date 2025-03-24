import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import  Post  from "../../components/Post"; 
import { StyleSheet } from "nativewind";
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
      {/* Header */}
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row justify-between items-center mb-5">
        <View className="flex-row items-center">
          <Image
            source={require("../../assets/images/student_logo.png")}
            className="rounded-full mr-3"
            style={styles.profilePic}
          />
          <Text className="text-white text-lg">
            Hello, <Text className="font-bold text-blue-400">{username}</Text>
          </Text>
        </View>
        <TouchableOpacity>
          <Feather name="message-square" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Divider before first post */}
      <View className="border-b border-gray-800 mb-4" />

      {/* Posts */}
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          profileImage={require("../../assets/images/student_logo.png")}
          name={post.name}
          bio={post.bio}
          postText={post.postText}
          postImageUri={post.postImageUri}
          additionalText={post.additionalText}
        />
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