import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { Icon } from "@/assets/icons";
import { theme } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import { router } from "expo-router";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function index() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, isLoading] = useState(false);

  // Function to get user data from the stored token
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
          `/api/post?limit=${limit}`,
        {
          headers: {
            token: await SecureStore.getItemAsync("token"),
          },
        }
      );

      if (response.data.posts) {
        setPosts([...response.data.posts]);
        setHasMore(response.data.hasMore); // Check if there are more posts
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }
  return (
    <ScreenWrapper bg={"white"}>
      <FlatList
        data={posts}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <PostCard item={item} user={user} postuser={user} />
        )}
        ListFooterComponent={
          <>
            {hasMore ? (
              <View style={{ marginVertical: posts.length == 0 ? 100 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts}>
                  {posts.length > 0 ? "No more posts" : "No posts to show"}
                </Text>
              </View>
            )}
          </>
        }
        onEndReached={() => {
          if (hasMore) {
            getPosts();
          }
        }}
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        onEndReachedThreshold={0}
        ListHeaderComponent={<UserHeader user={user} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    elevation: 7,
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: theme.colors.textLight,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: wp(4),
  },
  info: {
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
});
const UserHeader = ({ user }) => {
  const USER_IMAGE =
    user?.image ||
    "https://fra.cloud.appwrite.io/v1/storage/buckets/67f8e53c0001a80cdbde/files/680565aa00223ec57c6d/view?project=67f8e5020020502a85c0&mode=admin";

  const navigation = useNavigation();
  const handleLogout = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Remove token from SecureStore
            await SecureStore.deleteItemAsync("token");

            navigation.reset({
              index: 0,
              routes: [{ name: "login" }], // replace with your actual route name
            });
          } catch (error) {
            console.error("Logout failed:", error);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title={"Profile"} showBackButton mb={30} />

        <TouchableOpacity
          onPress={() => {
            handleLogout();
          }}
          style={styles.logoutButton}
        >
          <Icon
            name={"logout"}
            color={theme.colors.rose}
            onPress={handleLogout}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.profile_pic || USER_IMAGE}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => {
                if (user?.course) {
                  router.push("/(main)/editStudentProfile");
                } else {
                  router.push("/(main)/editAlumniProfile");
                }
              }}
            >
              <Icon name={"edit"} strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>{user?.full_name} </Text>
            <Text
              style={{
                color: theme.colors.textLight,
                fontSize: 12,
                opacity: 0.6,
              }}
            >
              {user?.passout_year ? "(Student)" : "(Alumni)"}
            </Text>
            {user?.bio && <Text style={styles.infoText}>{user?.bio}</Text>}
          </View>

          <View style={{ gap: 10 }}>
            {user?.email && (
              <View style={styles.info}>
                <Icon name={"mail"} size={20} color={theme.colors.textLight} />
                <Text>{user.email}</Text>
              </View>
            )}
            {user?.phone_no && (
              <View style={styles.info}>
                <Icon name={"call"} size={20} color={theme.colors.textLight} />
                <Text>{user.phone_no}</Text>
              </View>
            )}
            {user?.course && (
              <View style={styles.info}>
                <MaterialCommunityIcons
                  name="book-open"
                  size={20}
                  color={theme.colors.textLight}
                />
                <Text>{user.course}</Text>
              </View>
            )}
            {user?.college && (
              <View style={styles.info}>
                <MaterialCommunityIcons
                  name="school"
                  size={20}
                  color={theme.colors.textLight}
                />
                <Text>{user.college}</Text>
              </View>
            )}
            {user?.curr_work && (
              <View style={styles.info}>
                <MaterialCommunityIcons
                  name="office-building"
                  size={20}
                  color={theme.colors.textLight}
                />
                <Text>{user.curr_work}</Text>
              </View>
            )}
            {user?.position && (
              <View style={styles.info}>
                <MaterialCommunityIcons
                  name="briefcase"
                  size={20}
                  color={theme.colors.textLight}
                />
                <Text>{user.position}</Text>
              </View>
            )}
            {user?.batch && (
              <View style={styles.info}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={theme.colors.textLight}
                />
                <Text>{user.batch}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
