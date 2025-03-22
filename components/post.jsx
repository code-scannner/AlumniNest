import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

const PostPage = ({ 
  profileImage = require("../../assets/images/student_logo.png"),
  name = "John Doe",
  bio = "Developer | Designer",
  postText = "This is an example post. It can contain multiple lines of text, images, and more.",
  postImageUri = "https://via.placeholder.com/300x200",
  additionalText = "Here is some additional text to show more of the post content."
}) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentToggle = () => {
    setShowCommentBox(prev => !prev);
  };

  const submitComment = () => {
    console.log("Submitted comment:", commentText);
    setCommentText("");
    setShowCommentBox(false);
  };

  return (
    <ScrollView className="flex-1 bg-primary-dark p-5">
      {/* Header: Profile picture, name and bio */}
      <View className="flex-row items-center mb-4">
        <Image
          source={profileImage}
          style={{ width: 30, height: 30 }}
          className="rounded-full mr-3"
        />
        <View>
          <Text className="text-white text-lg font-bold">{name}</Text>
          <Text className="text-gray-400 text-sm">{bio}</Text>
        </View>
      </View>

      {/* Post Content */}
      <View className="mb-4">
        <Text className="text-white text-base mb-2">{postText}</Text>
        {postImageUri ? (
          <Image
            source={{ uri: postImageUri }}
            className="w-full h-48 rounded-lg mb-2"
          />
        ) : null}
        <Text className="text-white text-base">{additionalText}</Text>
      </View>

      {/* Post Actions */}
      <View className="flex-row justify-around border-t border-gray-700 pt-3">
        <TouchableOpacity onPress={handleLike} className="flex-row items-center">
          <Feather name="heart" size={20} color="#ffffff" />
          <Text className="text-white ml-1">Like ({likeCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentToggle} className="flex-row items-center">
          <Feather name="message-circle" size={20} color="#ffffff" />
          <Text className="text-white ml-1">Comment</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Box */}
      {showCommentBox && (
        <View className="mt-4">
          <TextInput
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            placeholder="Write a comment..."
            placeholderTextColor="#bbb"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity
            onPress={submitComment}
            className="bg-blue-500 py-2 rounded-lg mt-2 items-center"
          >
            <Text className="text-black font-bold">Submit Comment</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default PostPage;
