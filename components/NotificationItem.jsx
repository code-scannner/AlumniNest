import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import moment from "moment";
import { router } from "expo-router";

// Mock avatar if no real image is available
const defaultAvatar = require("@/assets/images/alumni.jpg");

const NotificationItem = ({ item }) => {
  const handleClick = () => {
    const type = item.type;
    switch (type) {
      case "connection_request":
        router.push({
          pathname: "/requestPage"
        });
      case "connection_accepted":
        router.push({
          pathname: "/connections"
        });
      case "post_created":
        router.push({
          pathname: "/postDetails",
          params: {
            post_id: item?.redirect_id,
          },
        });
      case "post_liked":
        router.push({
          pathname: "/postDetails",
          params: {
            post_id: item?.redirect_id,
          },
        });
      case "post_commented":
        router.push({
          pathname: "/postDetails",
          params: {
            post_id: item?.redirect_id,
          },
        });
      default:
        break;
    }
  };

  const handleProfileClick = () => {
    router.push({
      pathname: "/userProfile",
      params: {
        user_id: item?.user_id,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <TouchableOpacity onPress={handleProfileClick} activeOpacity={0.8}>
        <Image
          source={{ uri: item?.profile_pic || defaultAvatar }}
          style={{ width: hp(5), height: hp(5), borderRadius: hp(5) / 2 }}
        />
      </TouchableOpacity>

      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.full_name}</Text>
        <Text style={[styles.contentText, { color: theme.colors.textLight }]}>
          {item?.content}
        </Text>
      </View>

      <Text style={styles.timetext}>{moment(item?.created_at).fromNow()}</Text>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 10,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.5),
    fontWeight: "600",
    color: theme.colors.light,
  },

  timetext: {
    fontSize: hp(1.3),
    fontWeight: "400",
    color: theme.colors.textLight,
  },
  contentText: {
    fontSize: hp(1.3),
    fontWeight: "400",
    color: theme.colors.textLight,
  },
});
