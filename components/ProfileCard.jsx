import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { wp, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";

export default function ProfileCard({ user, status = "connect", onPress }) {
  const getButtonLabel = () => {
    if (status === "pending") return "Pending";
    if (status === "remove") return "Remove";
    return "Connect";
  };

  const getButtonStyle = () => {
    switch (status) {
      case "pending":
        return styles.pendingBtn;
      case "remove":
        return styles.removeBtn;
      default:
        return styles.connectBtn;
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{user.full_name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, getButtonStyle()]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{getButtonLabel()}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(4),
    backgroundColor: "white",
    borderRadius: theme.radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: hp(1),
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: hp(3.25),
    marginRight: wp(3),
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: hp(2.2),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  username: {
    fontSize: hp(1.8),
    color: theme.colors.textLight,
  },
  button: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: theme.radius.sm,
  },
  connectBtn: {
    backgroundColor: theme.colors.primary,
  },
  pendingBtn: {
    backgroundColor: "#ddd",
  },
  removeBtn: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
});
