import { hp, wp } from "@/helpers/common";
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from "@/assets/icons";
import React, { useEffect, useState, useCallback } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { router } from "expo-router";
import { theme } from "@/constants/theme";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Avatar from "../../components/Avatar";

let limit = 0;
const home = () => {
  //   const { user } = useAuth();

  //   const [posts, setPosts] = useState([]);
  //   const [hasMore, setHasMore] = useState(true);
  //   const [notoficationCount, setNotificationCount] = useState(0);

  //   const handlePostEvent = async (payload) => {
  //     try {
  //       console.log("Received Post Event:", payload);

  //       if (!payload?.eventType) {
  //         console.warn("Invalid payload: Missing eventType");
  //         return;
  //       }

  //       switch (payload.eventType) {
  //         case "INSERT":
  //           if (!payload.new?.id) {
  //             console.warn("Invalid INSERT payload: Missing new post ID");
  //             return;
  //           }

  //           try {
  //             const newPost = { ...payload.new };
  //             const res = await getUserData(newPost.userId);

  //             if (res.success) {
  //               newPost.user = res.data;
  //               newPost.postLikes = [];
  //               newPost.comments = [{ count: 0 }];

  //               // Update state only after getting user data
  //               setPosts((prevPosts) => [newPost, ...prevPosts]);
  //             } else {
  //               console.warn("User data fetch failed, post not added");
  //             }
  //           } catch (error) {
  //             console.error("Error fetching user data for new post:", error);
  //           }
  //           break;
  //         case "UPDATE":
  //           if (!payload.new?.id) {
  //             console.warn("Invalid INSERT payload: Missing new post ID");
  //             return;
  //           }

  //           try {
  //             const newPost = { ...payload.new };
  //             const res = await getUserData(newPost.userId);

  //             if (res.success) {
  //               newPost.user = res.data;
  //               newPost.postLikes = [];
  //               newPost.comments = [{ count: 0 }];

  //               // update the new body and file!
  //               setPosts((prevPosts) => {
  //                 const index = prevPosts.findIndex(
  //                   (post) => post.id === newPost.id
  //                 );
  //                 if (index !== -1) {
  //                   return [
  //                     ...prevPosts.slice(0, index),
  //                     newPost,
  //                     ...prevPosts.slice(index + 1)
  //                   ];
  //                 } else {
  //                   return [...prevPosts, newPost];
  //                 }
  //               });
  //             } else {
  //               console.warn("User data fetch failed, post not added");
  //             }
  //           } catch (error) {
  //             console.error("Error fetching user data for new post:", error);
  //           }
  //           break;

  //         case "DELETE":
  //           if (!payload.old?.id) {
  //             console.warn("Invalid DELETE payload: Missing old post ID");
  //             return;
  //           }

  //           setPosts((prevPosts) =>
  //             prevPosts.filter((post) => post.id !== payload.old.id)
  //           );
  //           break;

  //         default:
  //           console.warn("Unhandled event type:", payload.eventType);
  //       }
  //     } catch (error) {
  //       console.error("Error handling post event:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     let postChannel = supabase
  //       .channel("posts")
  //       .on(
  //         "postgres_changes",
  //         { event: "*", schema: "public", table: "posts" },
  //         handlePostEvent
  //       )
  //       .subscribe();
  //     console.log({ postChannel });
  //     // getPosts();

  //     return () => {
  //       supabase.removeChannel(postChannel);
  //     };
  //   }, []);

  //   const handleNotfication = async (payload) => {
  //     if (payload.eventType === "INSERT" && payload.new.id) {
  //       setNotificationCount((prev) => prev + 1);
  //     }

  //     console.log("Notification payload:", payload);
  //   };
  //   useEffect(() => {
  //     let notificationChannel = supabase
  //       .channel("posts")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "*",
  //           schema: "public",
  //           table: "notifications",
  //           filter: `receiverId=eq.${user.id}`
  //         },
  //         handleNotfication
  //       )
  //       .subscribe();
  //     console.log({ notificationChannel });
  //     // getPosts();

  //     return () => {
  //       supabase.removeChannel(notificationChannel);
  //     };
  // //   }, []);
  //   const getPosts = async () => {
  //     limit = limit + 5;
  //     let res = await fetchPosts(limit);
  //     if (res.success) {
  //       if (posts.length == res.data?.length) setHasMore(false);
  //       setPosts(res.data);
  //     }
  //     console.log({ res: res.data[0] });

  //   };
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, isLoading] = useState(false);
  const [notificationCount,setNotificationCount]=useState(0);
  const fetchUser = async () => {
    isLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) throw new Error("No token found");

      const response = await axios.get(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/profile",
        {
          headers: { token: `${token}` },
        }
      );

      setUser(response.data.info);
      console.log(response)
      console.log(user)
    } catch (error) {
      console.error("Failed to fetch user:", error.message);
    } finally {
      isLoading(false);
    }
  };
 
  const getPosts = async () => {
    if (!hasMore) return;
    setLimit((prev) => prev + 20); // Increase limit for next fetch

    try {
      const response = await axios.get(
        "http://" +
          Constants.expoConfig.extra.baseurl +
          `/api/feed?limit=${limit}`,
        {
          headers: {
            token: await SecureStore.getItemAsync("token"),
          },
        }
      );

      if (response.data.posts) {
        setPosts([...response.data.posts]);
        setHasMore(response.data.hasMore); 
      } else {
        console.error("Failed to fetch posts:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (hasMore) {
      getPosts();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (hasMore) {
        getPosts();
        console.log("Fetching posts...");
      }
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* Header! */}
        <View style={styles.header}>
          <Text style={styles.title}>AlumniNest</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("network")}>
              <Icon
                name={"user"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setNotificationCount(0);
                router.push("notifications");
              }}
            >
              <Icon
                name={"heart"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
              {notificationCount > 0 && (
                <>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{notificationCount}</Text>
                  </View>
                </>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Text>
                <Icon
                  name={"plus"}
                  size={hp(3.2)}
                  strokeWidth={2}
                  color={theme.colors.text}
                />
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Text>
                <Avatar
                  uri={
                    user?.profile_pic
                  }
                  size={hp(4.3)}
                  rounded={theme.radius.sm}
                  style={{ borderWidth: 1 }}
                />
              </Text>
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <PostCard item={item} user={item.poster_id} />}
          ListFooterComponent={
            <>
              {hasMore ? (
                <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
                  <Loading />
                </View>
              ) : (
                <View style={{ marginVertical: 30 }}>
                  <Text style={styles.noPosts}>No more posts</Text>
                </View>
              )}
            </>
          }
          onEndReached={() => {
            if (hasMore) {
              getPosts();
            }
          }}
          onEndReachedThreshold={0}
        />
      </View>
    </ScreenWrapper>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: "700",
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderWidth: 3,
    borderColor: theme.colors.gray,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    backgroundColor: theme.colors.roseLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: hp(2.2),
    height: hp(2.2),
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: "bold",
  },
});
