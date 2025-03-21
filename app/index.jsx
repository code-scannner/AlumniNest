import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useRouter, Stack } from "expo-router";

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Background Image */}
      <Image
        source={require("../assets/images/background.jpg")}
        style={styles.backgroundImage}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Branding Section */}
        <Text style={styles.title} className="text-3xl">
          Welcome to
        </Text>

        <Text style={styles.headtitle}>
          Alumni <Text style={styles.headhighlight}>Nest</Text>
        </Text>
        <Text style={styles.description}>
          A platform that connects students and alumni, fostering mentorship,
          networking, and career growth. Stay connected, share experiences, and
          help each other grow!
        </Text>

        {/* Illustrative Image */}
        <Image
          source={require("../assets/images/alumni_network.jpg")}
          style={styles.illustration}
        />

        {/* Buttons Section */}
        <View style={styles.buttonRow} className="gap-x-2">
          <TouchableOpacity
            style={[styles.button, { marginRight: 10 }]}
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

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E3F2FD" },
  highlight: {
    color: "#1565C0", // Medium blue highlight
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#0D47A1",
    textAlign: "center",
    marginBottom: 5,
  },
  highlight: {
    color: "#1565C0",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  illustration: {
    width: 250,
    height: 180,
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
    borderColor: "#0D47A1",
    borderWidth: 2,
  },
  headtitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#0D47A1", // Deep blue
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
    fontFamily: "Sans",
    textDecorationStyle: "solid",
  },
  headhighlight: {
    color: "#1565C0", // Medium blue highlight
  },
  buttonText: {
    color: "#0D47A1",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#0D47A1",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonOutlineText: {
    color: "#0D47A1",
    fontSize: 16,
    fontWeight: "bold",
  },
});
