import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default _layout;
