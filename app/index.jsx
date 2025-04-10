import { theme } from "@/constants/theme";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
      }}
    >
      <ActivityIndicator size={"small"} color={theme.colors.primary} />
    </View>
  );
}