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
export default function MessageCard({ item }) {
  return (
    <TouchableOpacity
    onPress={()=>
      router.push({
        pathname: "/(main)/chatPage",
        params: { chat_id: item?._id },
      })
    }>
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(main)/userProfile",
              params: { user_id: item?.user_id },
            })
          }
        >
          <Image
            source={{
              uri:
                item?.profile_pic ||
                "https://fra.cloud.appwrite.io/v1/storage/buckets/67f8e53c0001a80cdbde/files/67fecfeb003d718fc6cc/view?project=67f8e5020020502a85c0&mode=admin",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.name}>{item.full_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: hp(1.6),
  },
  iconButtons: {
    flexDirection: "row",
    gap: wp(4),
  },
});
