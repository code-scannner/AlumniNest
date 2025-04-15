import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { wp, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
export default function ProfileCard({
  user,
  status = "connect",
  onPress,
  ShowRequestButton = false,
}) {
  const getButtonIcon = () => {
    switch (status) {
      case "pending":
        return { name: "clock", color: "#555" };
      case "remove":
        return { name: "user-x", color: "hsl(0, 97.50%, 68.20%)" };
      case "connect":
      default:
        return { name: "user-plus", color: "hsl(126, 58.70%, 43.70%)" };
    }
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
        <Text style={styles.name}>{user.full_name}(<Text>{user.userType}</Text>)</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>
      {!ShowRequestButton && (
        <TouchableOpacity
          style={[styles.button, getButtonStyle()]}
          onPress={onPress}
        >
          <Feather
            name={getButtonIcon().name}
            size={hp(2)}
            color={getButtonIcon().color}
          />
        </TouchableOpacity>
      )}
      {ShowRequestButton && (
        <View style={styles.iconButtons}>
          <TouchableOpacity
            onPress={() => onPress("accept")}
            style={styles.greeniconBtn}
          >
            <Feather name="check" size={hp(2.2)} color="green" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPress("reject")}
            style={styles.rediconBtn}
          >
            <Feather name="x" size={hp(2.2)} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(2),
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "hsl(0, 0%, 85%)",
    borderRadius: theme.radius.lg,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: hp(1),
  },
  avatar: {
    height: hp(4.5),
    width: hp(4.5),
    borderRadius: hp(3.25),
    marginRight: wp(3),
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  username: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
  },
  button: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: theme.radius.sm,
  },
  connectBtn: {
    borderWidth: 1,
    borderColor: "hsl(126, 58.70%, 43.70%)",
  },
  pendingBtn: {
    borderWidth: 1,
    borderColor: "hsl(0, 0.80%, 49.40%)",
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: "hsl(0, 97.50%, 68.20%)",

  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: hp(1.6),
  },
  iconButtons: {
    flexDirection: "row",
    gap: wp(4),
  },
  rediconBtn: {
    padding: wp(1),
    borderWidth: 1,
    borderColor: "hsl(0, 88.70%, 72.40%)",
    borderRadius: theme.radius.sm,
  },
  greeniconBtn: {
    padding: wp(1),
    borderWidth: 1,
    borderColor: "hsl(120, 46.60%, 45.50%)",
    borderRadius: theme.radius.sm,
  },
});
