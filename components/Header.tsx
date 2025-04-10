
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import BackButton from "./BackButton";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";

type Props = {};

const Header = ({ title, showBackButton = true, mb = 10 }) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: mb
        }
      ]}
    >
      {showBackButton && (
        <>
          <View style={styles.showBackButton}>
            <BackButton />
          </View>
        </>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    gap: 10
  },
  showBackButton: {
    position: "absolute",
    left: 0
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: "700",
    color: theme.colors.text
  }
});
