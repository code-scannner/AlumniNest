import React, { forwardRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle
} from "react-native";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";

interface InputProps extends TextInputProps {
  containerStyles?: ViewStyle;
  icon?: React.ReactNode;
}

// Forwarding ref to allow external control of TextInput
const Input = forwardRef<TextInput, InputProps>(
  ({ containerStyles, icon, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyles]}>
        {icon && icon}
        <TextInput
          style={{ flex: 1 }}
          placeholderTextColor={theme.colors.textLight}
          ref={ref}
          {...props}
        />
      </View>
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    paddingHorizontal: 18,
    gap: 12
  }
});