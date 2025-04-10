import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Button } from "react-native";

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
        <Button title="welcome" onPress={()=>router.push('/welcome')}/>
      <ActivityIndicator size={"small"} color={theme.colors.primary} />
    </View>
  );
}