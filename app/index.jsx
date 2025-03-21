import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import "../global.css";

export default function HomePage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primary-dark">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        className="mt-40"
      >
        {/* Branding Section */}
        <Text className="text-4xl font-bold text-primary-900 text-center mb-1">
          Welcome to
        </Text>
        <Text className="text-5xl font-bold italic text-primary-600 text-center mb-5">
          Alumni <Text className="text-primary-500">Nest</Text>
        </Text>
        <Text className="text-xl text-center text-primary-200 px-5 mt-5 mb-5">
          A platform that connects students and alumni, fostering mentorship,
          networking, and career growth. Stay connected, share experiences, and
          help each other grow!
        </Text>
        <Image
          source={require("../assets/images/alumni_network.jpg")}
          style={styles.illustration}
        />
        {/* Buttons Section */}
        <View style={{ marginTop:10, display:"flex", flexDirection:"row", gap:10, alignItems: "center" }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  illustration: {
    width: 250,
    height: 180,
    marginTop: 20,
    marginBottom: 25,
    borderRadius: 10,
  },
  button: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  buttonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "bold",
  },
});
