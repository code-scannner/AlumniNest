import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import moment from "moment";

// Mock avatar if no real image is available
const defaultAvatar = require("@/assets/images/alumni.jpg");
 // Can change to any placeholder image

const NotificationItem = ({ item }) => {
  const handleClick = () => {
    console.log("Notification pressed:", item.title);
    // Disabled routing for frontend-only view
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Image
        source={{ uri: item?.sender?.image || defaultAvatar }}
        style={{ width: hp(5), height: hp(5), borderRadius: hp(5) / 2 }}
      />

      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {item?.title}
        </Text>
      </View>

      <Text style={styles.text}>
        {moment(new Date(item?.created_at)).format("MMM D")}
      </Text>
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
    gap: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous"
  },
  nameTitle: {
    flex: 1,
    gap: 2
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: "600",
    color: theme.colors.text
  }
});
