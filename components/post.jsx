import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "nativewind";

const Post = ({
  id,
  profileImage,
  name,
  bio,
  postText,
  postImageUri,
  additionalText,
}) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked(!isLiked);
  };

  const submitComment = () => {
    console.log(`Comment on post ${id}:`, commentText);
    setCommentText("");
    setShowCommentBox(false);
  };

  return (
    <View className="mb-6 border-b border-gray-800 pb-4">
      <View className="flex-row items-center mb-3">
        <Image
          source={profileImage}
          className="w-8 h-8 rounded-full mr-2"
          style={styles.profilePic}
        />
        <View>
          <Text className="text-white font-semibold">{name}</Text>
          <Text className="text-gray-400 text-sm">{bio}</Text>
        </View>
      </View>

      <Text className="text-white mb-2">{postText}</Text>
      {postImageUri ? (
        <Image
          source={{ uri: postImageUri }}
          className="w-full h-48 rounded-lg mb-2"
          style={styles.profilePic}
        />
      ) : null}

      <View className="flex-row justify-around mt-3">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={handleLike}
        >
          <Feather name="heart" size={18} color="#fff" />
          <Text className="text-white ml-1">Like ({likeCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setShowCommentBox((prev) => !prev)}
        >
          <Feather name="message-circle" size={18} color="#fff" />
          <Text className="text-white ml-1">Comment</Text>
        </TouchableOpacity>
      </View>

      {showCommentBox && (
        <View className="mt-3">
          <TextInput
            placeholder="Write a comment..."
            placeholderTextColor="#bbb"
            value={commentText}
            onChangeText={setCommentText}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          />
          <TouchableOpacity
            className="bg-blue-500 py-2 rounded-lg mt-2 items-center"
            onPress={submitComment}
          >
            <Text className="text-black font-bold">Submit Comment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Post;
const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
