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

export default function index() {
  const { post_id, user_id } = useLocalSearchParams();
  console.log(post_id, user_id);
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const handleNewComment = async (payload) => {
  //   if (payload.new) {
  //     let newComment = { ...payload.new };
  //     let res = await getUserData(newComment.userId);
  //     newComment.user = res.success ? res.data : {};
  //     setPost((prevPost) => {
  //       const newComments = [...prevPost.comments];
  //       newComments.push(newComment);
  //       return { ...prevPost, comments: newComments };
  //     });
  //   }
  // };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
            "http://"+Constants.expoConfig.extra.baseurl+`/api/post/${post_id}` );

        setPost(response.data.post);
        setComments(response.data.comments);
        
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    // }
    // let commentChannel = supabase
    //   .channel("comments")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "INSERT",
    //       schema: "public",
    //       table: "comments",
    //       filter: "postId=eq." + postId
    //     },
    //     handleNewComment
    //   )
    //   .subscribe();
    // // getPosts();
    // getPostDetails();

    // return () => {
    //   supabase.removeChannel(commentChannel);
    // };
  }, []);

  // const getPostDetails = async () => {
  //   let res = await fetchPostDeatils(postId);
  //   if (res.success) {
  //     setLoading(false);
  //     setPost(res.data);
  //   }
  // };

  // const onNewComment = async () => {
  //   if (!inputRef.current) return null;

  //   let data = {
  //     userId: user?.id,
  //     postId: postId,
  //     text: commentValue
  //   };

  //   setIsLoading(true);

  //   let res = await createComment(data);
  //   if (res.success) {
  //     inputRef.current = "";
  //     setCommentValue("");

  //     if (user.id != post.userId) {
  //       let notify = {
  //         senderId: user.id,
  //         receiverId: post.userId,
  //         title: "commented on your post",
  //         data: JSON.stringify({ postId: post.id, commentId: res.data.id })
  //       };
  //       setIsLoading(false);

  //       await createNotifications(notify);
  //     }
  //   } else {
  //     Alert.alert("comment", res.msg);
  //   }
  // };

  // const onDeleteComment = async (comment) => {
  //   let res = await deleteComment(comment.id);

  //   if (res.success) {
  //     setPost((prevPost) => {
  //       let updatedPost = { ...prevPost };
  //       updatedPost.comments = updatedPost.comments.filter(
  //         (c) => c.id !== comment.id
  //       );
  //       return updatedPost;
  //     });
  //   } else {
  //     Alert.alert("comment", res.msg);
  //   }
  // };

  // const onDeletePost = async (item) => {
  //   let res = await removePost(item?.id);

  //   if (res.success) {
  //     router.back();
  //   } else {
  //     Alert.alert("Post", res.msg);
  //   }
  // };
  // const onEditPost = async (item) => {
  //   router.back();
  //   router.push({
  //     pathname: "/newPost",
  //     params: {
  //       ...item
  //     }
  //   });
  // };

  // if (loading) {
  //   return (
  //     <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
  //       <Loading />
  //     </View>
  //   );
  // }

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
        <PostCard
          item={post}
          user={{_id : user_id}}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          // onDelete={onDeletePost}
          // onEdit={onEditPost}
        />

        <View style={styles.inputContainer}>
          <Input
            placeholderTextColor={theme.colors.textLight}
            containerStyles={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
            placeholder="Type comment..."
            ref={inputRef}
            value={commentValue}
            //    onChangeText={setCommentValue}
          />
          {isLoading ? (
            <>
              <Loading size="small" />
            </>
          ) : (
            <TouchableOpacity
              style={styles.sendIcon}
              //    onPress={onNewComment}
            >
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
                canDelete={
                  user_id === comment?.user_id?._id || user_id === post?.poster_id
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
