import { View, Text, StatusBar, Pressable } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { Icon } from "../assets/icons";
type Props = {};

const BackButton = ({ size = 26 }: Props) => {
  return (
    <Pressable
      style={{
        alignSelf: "flex-start",
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: "rgba(0,0,0,0.07)"
      }}
      onPress={() => {
        router.back();
      }}
    >
      <Icon
        name={"arrowLeft"}
        strokeWidth={2.5}
        size={size}
        color={theme.colors.text}
      />
    </Pressable>
  );
};

export default BackButton;