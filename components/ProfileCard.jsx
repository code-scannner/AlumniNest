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
export default function ProfileCard({
  user,
  status = "accepted",
  onPress,
  showMessageButton = false,
  ShowRequestButton = false,
  onAccept = () => {},
  onReject = () => {},
}) {
  const [localStatus, setLocalStatus] = useState(status);

  useEffect(() => {
    setLocalStatus(status); // Keep localStatus in sync with prop if it changes
  }, [status]);

  const getButtonIcon = () => {
    switch (localStatus) {
      case "pending":
        return { name: "clock", color: "#555" };
      case "accepted":
        return { name: "user-x", color: "hsl(0, 97.50%, 68.20%)" };
      case "not_connected":
        return { name: "user-plus", color: "hsl(126, 58.70%, 43.70%)" };
      default:
        return { name: "user-x", color: "hsl(0, 97.50%, 68.20%)" };
    }
  };

  const getButtonStyle = () => {
    switch (localStatus) {
      case "pending":
        return styles.pendingBtn;
      case "accepted":
        return styles.removeBtn;
      case "not_connected":
        return styles.connectBtn;
      default:
        return styles.removeBtn;
    }
  };

  const onConnect = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (localStatus === "not_connected") {
        setLocalStatus("pending");
        const response = await axios.post(
          `http://${Constants.expoConfig.extra.baseurl}/api/connect/request/${user._id}`,
          {},
          { headers: { token } }
        );
        console.log("Connect response:", response.data);
      } else if (localStatus === "accepted") {
        Alert.alert(
          "Remove Connection",
          "Are you sure you want to remove this connection?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                setLocalStatus("not_connected");
                const response = await axios.delete(
                  `http://${Constants.expoConfig.extra.baseurl}/api/connect/remove/${user._id}`,
                  { headers: { token } }
                );
                console.log("Remove response:", response.data);
                if (onPress) onPress();
              },
              style: "destructive",
            },
          ]
        );
        return; // prevent onPress call here
      }

      if (onPress && localStatus !== "accepted") onPress();
    } catch (error) {
      console.error("Error handling connection:", error.message);
    }
  };

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
          {user.full_name + " "}
          <Text
            style={{
              color: theme.colors.textLight,
              fontSize: 12,
              opacity: 0.6,
              fontWeight: "500",
            }}
          >
            (
            {user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
            )
          </Text>
        </Text>

        <Text style={styles.username}>@{user.username}</Text>
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
