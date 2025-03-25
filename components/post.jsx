import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { StyleSheet ,Pressable} from "react-native";

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
    <View className="mb-6 border-b border-primary-999 pb-4">
      <View className="flex-row items-center mb-3">
        <Image
          source={profileImage}
          className="w-8 h-8 rounded-full mr-2"
          style={styles.profilePic}
        />
        <View>
          <Text className="text-primary-500 font-semibold">{name}</Text>
          <Text className="text-white text-sm">{bio}</Text>
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

      <View className="flex-row justify-around mt-3" >
        <TouchableOpacity className="flex-row items-center" onPress={handleLike}>
          <Feather name="heart" size={15} color="#fff" />
          <Text style={{ textDecorationLine: "none" }} className="text-white px-2">Like ({likeCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center px-3" onPress={() => setShowCommentBox((prev) => !prev)}>
          <Feather name="message-circle" size={15} color="#fff" />
          <Text style={{ textDecorationLine: "none" }} className="text-white px-2">Comment</Text>
        </TouchableOpacity>
      </View>

      {showCommentBox && (
        <View className="mt-3">
          <TextInput
            placeholder="Write a comment..."
            placeholderTextColor="#bbb"
            value={commentText}
            onChangeText={setCommentText}
            className="bg-primary-700 text-white px-4 py-2 rounded-lg"
            multiline="true"
          />
          <Pressable onPress={submitComment} className="bg-primary-400 py-1 px-5 rounded-lg items-center mt-4 w-1/2">
            <Text style={{ textDecorationLine: "none" }} className="text-black  font-bold">Submit Comment</Text>
          </Pressable>
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
