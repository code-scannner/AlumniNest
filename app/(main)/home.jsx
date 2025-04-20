import { hp, wp } from "@/helpers/common";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "@/assets/icons";
import React, { useEffect, useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
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

const home = () => {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, isLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
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
      console.log(response);
      console.log(user);
    } catch (error) {
      console.error("Failed to fetch user:", error.message);
    } finally {
      isLoading(false);
    }
  };

  const getPosts = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!hasMore) return;
    setLimit((prev) => prev + 20); // Increase limit for next fetch

    try {
      const response = await axios.get(
        "http://" +
          Constants.expoConfig.extra.baseurl +
          `/api/feed?limit=${limit}`,
        {
          headers: {
            token,
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
    const getNotificationCount = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get(
          "http://" +
            Constants.expoConfig.extra.baseurl +
            "/api/notification/count",
          {
            headers: {
              token,
            },
          }
        );
        setNotificationCount(response.data.unreadCount);
        console.log(notificationCount);
      } catch (error) {
        console.error("Failed to fetch notification count:", error.message);
      }
    };

    getNotificationCount();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

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

  const onPress = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        "http://" +
          Constants.expoConfig.extra.baseurl +
          "/api/notification/readall",
        {},
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        setNotificationCount(0);
        router.push("notifications");
      } else {
        console.warn("Failed to mark notifications as read");
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error.message);
    }
  };

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
            <Pressable onPress={() => router.push("messages")}>
              <Feather
                name={"message-circle"} // or any appropriate icon name like "message"
                size={hp(3)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("network")}>
              <Feather
                name={"globe"}
                size={hp(3)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={onPress}>
              <Icon
                name={"heart"}
                size={hp(3)}
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
                  size={hp(3)}
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
                      ? user.profile_pic
                      : "https://fra.cloud.appwrite.io/v1/storage/buckets/67f8e53c0001a80cdbde/files/680565aa00223ec57c6d/view?project=67f8e5020020502a85c0&mode=admin"
                  }
                  size={hp(4)}
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
          renderItem={({ item }) => (
            <PostCard item={item} user={user} postuser={item?.poster_id} />
          )}
          ListFooterComponent={
            <>
              {hasMore ? (
                <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
                  <Loading />
                </View>
              ) : (
                <View style={{ marginVertical: 30 }}>
                  <Text style={styles.noPosts}>{posts.length > 0 ? "No more posts" : "Connect and interact!"}</Text>
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
    gap: 12,
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
