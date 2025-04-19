import React from "react";
import {
  Alert,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { wp, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { router } from "expo-router";
export default function MessageCard({
  chat,
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(main)/userProfile",
            params: { user_id: user?._id },
          })
        }
      >
        <Image
          source={{
            uri:
              user?.profile_pic ||
              "https://fra.cloud.appwrite.io/v1/storage/buckets/67f8e53c0001a80cdbde/files/67fecfeb003d718fc6cc/view?project=67f8e5020020502a85c0&mode=admin",
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name}>
          {user.full_name}
        </Text>
      </View>
      {!ShowRequestButton && (
        <View style={styles.iconButtons}>
          {showMessageButton && (
            <View style={styles.iconButtons}>
              <TouchableOpacity
                onPress={() => onAccept(user._id)}
                style={styles.msgButton}
              >
                <Feather name="message-square" size={hp(2.2)} color="grey" />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, getButtonStyle()]}
            onPress={onConnect}
          >
            <Feather
              name={getButtonIcon().name}
              size={hp(2)}
              color={getButtonIcon().color}
            />
          </TouchableOpacity>
        </View>
      )}
      {ShowRequestButton && (
        <View style={styles.iconButtons}>
          <TouchableOpacity
            onPress={() => onAccept(user._id)}
            style={styles.greeniconBtn}
          >
            <Feather name="check" size={hp(2.2)} color="green" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onReject(user._id)}
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
  msgButton: {
    padding: wp(2),
    borderWidth: 1,
    borderColor: "hsl(0, 2.30%, 65.50%)",
    borderRadius: theme.radius.sm,
  },
});
