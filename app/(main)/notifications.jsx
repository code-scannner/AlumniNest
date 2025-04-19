import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import NotificationItem from "../../components/NotificationItem"; 
import Loading from "@/components/Loading";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [limit, setLimit] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, isLoading] = useState(false);
  const getNotifications = async () => {
    try {
      isLoading(true);
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.get(
        "http://" +
          Constants.expoConfig.extra.baseurl +
          `/api/notification?limit=${limit}`,
        {
          headers: {
            token,
          },
        }
      );
      
      if (response.data.success) {
        setHasMore(response.data.hasMore);
        setNotifications([...response.data.notifications]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      isLoading(false);
    }
  };
  useEffect(() => {
    if (hasMore) {
      getNotifications();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (hasMore) {
        getNotifications();
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
        <Header title="Notifications" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => (
            <NotificationItem key={item._id} item={item} />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 12,
  },
  notificationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(5) / 2,
    marginRight: 12,
  },
  textSection: {
    flex: 1,
  },
  name: {
    fontSize: hp(1.7),
    fontWeight: "600",
    color: theme.colors.text,
  },
  message: {
    fontSize: hp(1.6),
    color: theme.colors.textDark,
  },
  time: {
    fontSize: hp(1.5),
    color: "#888",
    marginLeft: 10,
  },
});
