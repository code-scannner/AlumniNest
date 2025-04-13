import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from "react-native";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";

const defaultAvatar = require("@/assets/images/alumni.jpg");

const dummyNotifications = [
  {
    id: 1,
    sender: "Rohit Kumar",
    image: defaultAvatar,
    message: "commented on your post.",
    time: "2h ago"
  },
  {
    id: 2,
    sender: "Priya Mehta",
    image: defaultAvatar,
    message: "liked your comment.",
    time: "1d ago"
  },
  {
    id: 3,
    sender: "Anjali Sharma",
    image: defaultAvatar,
    message: "mentioned you in a post.",
    time: "Mar 10"
  }
];

export default function NotificationScreen() {
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {dummyNotifications.map((item) => (
            <View key={item.id} style={styles.notificationBox}>
              <Image source={item.image} style={styles.avatar} />
              <View style={styles.textSection}>
                <Text style={styles.name}>{item.sender}</Text>
                <Text style={styles.message}>{item.message}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp(4)
  },
  listStyle: {
    paddingVertical: 20,
    gap: 12
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
    elevation: 3
  },
  avatar: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(5) / 2,
    marginRight: 12
  },
  textSection: {
    flex: 1
  },
  name: {
    fontSize: hp(1.7),
    fontWeight: "600",
    color: theme.colors.text
  },
  message: {
    fontSize: hp(1.6),
    color: theme.colors.textDark
  },
  time: {
    fontSize: hp(1.5),
    color: "#888",
    marginLeft: 10
  }
});
