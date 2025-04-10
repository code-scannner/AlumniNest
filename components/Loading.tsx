import { View, ActivityIndicator } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";

type Props = {
  size: "large" | "small";
  color: string;
};

const Loading = ({ size = "large", color = theme.colors.primary }: Props) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;