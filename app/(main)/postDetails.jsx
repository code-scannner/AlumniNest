import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import { Icon } from "@/assets/icons";
import CommentItem from "@/components/CommentItem";
import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function index() {
  const { post_id, user_id } = useLocalSearchParams();
  const inputRef = useRef("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        setLoading(true);
        const response = await axios.get(
          "http://" +
            Constants.expoConfig.extra.baseurl +
            `/api/post/${post_id}`
        );

        setPost(response.data.post);
        setComments(response.data.comments);
        setCommentCount(response.data.post.total_comments);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get(
          "http://" + Constants.expoConfig.extra.baseurl + "/api/profile",
          {
            headers: { token: `${token}` },
          }
        );
        setUser(response.data.info);
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
      }
    };
    fetchUser();
    setLoading(false);
  }, []);

  const onNewComment = async () => {
    try {
      console.log("New Comment getting added ...");
      if (!inputValue) return null;

      console.log(inputRef);

      let data = {
        post_id,
        content: String(inputValue),
      };

      setIsLoading(true);

      const token = await SecureStore.getItemAsync("token");

      let res = await axios.post(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/post/comment",
        data,
        { headers: { token } }
      );

      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setCommentCount((prev) => prev + 1);
        setInputValue("");
        Alert.alert("Success", res.data.message);
      } else {
        Alert.alert("Error", res.data.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const onDeleteComment = async (id) => {
    Alert.alert("Confirm", "Are you sure to delete the comment?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = await SecureStore.getItemAsync("token");
          try {
            let res = await axios.delete(
              "http://" +
                Constants.expoConfig.extra.baseurl +
                `/api/post/comment/${id}`,
              {
                headers: { token: `${token}` },
              }
            );
            console.log("Delete Comment Response", res.data);
            if (res.data.success) {
              setComments((prevComments) =>
                prevComments.filter((comment) => comment._id !== id)
              );
              setCommentCount((prev) => prev - 1);
            } else {
              Alert.alert(
                "comment",
                res.data.message || "Failed to delete comment"
              );
            }
          } catch (error) {
            console.log("Error deleting comment:", error);
          }
        },
      },
    ]);
  };
  const onDeletePost = async () => {
    Alert.alert("Confirm", "Are you sure to delete the post?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = await SecureStore.getItemAsync("token");
          try {
            let res = await axios.delete(
              "http://" +
                Constants.expoConfig.extra.baseurl +
                `/api/post/${post_id}`,
              {
                headers: { token: `${token}` },
              }
            );
            console.log("Delete Comment Response", res.data);
            if (res.data.success) {
              router.back();
            } else {
              Alert.alert(
                "comment",
                res.data.message || "Failed to delete comment"
              );
            }
          } catch (error) {
            console.log("Error deleting comment:", error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Loading />
      </View>
    );
  }

  // if (!post) {
  //   return (
  //     <>
  //       <View
  //         style={[
  //           styles.center,
  //           { justifyContent: "flex-start", marginTop: 100 }
  //         ]}
  //       >
  //         <Text style={styles.notFound}>No post found</Text>
  //       </View>
  //     </>
  //   );
  // }
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {user && post && (
          <PostCard
            item={post}
            user={post.poster_id}
            hasShadow={false}
            showMoreIcon={false}
            showDelete={true}
            commentCount={commentCount}
            onDelete={onDeletePost}
            // onEdit={onEditPost}
          />
        )}

        <View style={styles.inputContainer}>
          <Input
            placeholderTextColor={theme.colors.textLight}
            containerStyles={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
            placeholder="Type comment..."
            value={inputValue}
            onChangeText={(v) => setInputValue(v)}
          />
          {isLoading ? (
            <>
              <Loading size="small" />
            </>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
              <Icon name={"send"} color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            marginVertical: 15,
            gap: 17,
          }}
        >
          {comments?.map((comment) => (
            <>
              <CommentItem
                item={comment}
                key={comment._id}
                handleDelete={() => onDeleteComment(comment._id)}
                canDelete={
                  user?._id === comment?.user?._id ||
                  user?._id === post?.poster_id
                }
                // highlight={comment.id === commentId}
                // onDelete={onDeleteComment}
              />
            </>
          ))}
          {comments?.length === 0 && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              Be first to comment!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
