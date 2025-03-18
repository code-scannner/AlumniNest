import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from "react-native";
import { Link, useRouter } from "expo-router";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";
import "../../global.css"

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <Pressable style={styles.backButton} onPress={() => router.push("index")}>
                <Feather name="arrow-left" size={24} color="white" />
            </Pressable>

            {/* Title */}
            <Text style={styles.title}>Alumni <Text style={styles.highlight}>Nest</Text></Text>
            <Text style={styles.textline}>Log in your account</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <SimpleLineIcons name="envelope" size={20} color="white" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <SimpleLineIcons name="lock" size={20} color="white" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="white" />
                </Pressable>
            </View>

            {/* Remember Me Checkbox */}
            <Pressable style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
                <Feather name={rememberMe ? "check-square" : "square"} size={20} color="white" />
                <Text style={styles.rememberText}> Remember for 30 days</Text>
            </Pressable>

            {/* Log In Button */}
            <Pressable style={styles.button} onPress={() => router.push("/HomePage/Home")}>
                <Text style={styles.buttonText}>LOG IN</Text>
            </Pressable>

            {/* Forgot Password & Sign Up Links */}
            <Link href="/forgot-password" asChild>
                <Pressable>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
            </Link>

            <Text style={styles.signupText}>Don’t have an account?
                <Link href="sign/signup"><Text style={styles.highlight}> Sign up</Text></Link>
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E3F2FD", // Light blue background
        padding: 20,
    },
    textline:{
        fontSize:15,
        marginBottom:20,
        color: "#1565C0"
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
    },
    title: {
        fontSize: 50,
        fontWeight: "bold",
        color: "#0D47A1", // Deep blue
        textAlign: "center",
        marginBottom:20,
        fontStyle: "italic",
        fontFamily:"Sans",
        textDecorationStyle: "solid",
    },
    highlight: {
        color: "#1565C0", // Medium blue highlight
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#BBDEFB", // Light blue-gray input field
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        width: "90%",
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: "#0D47A1", // Deep blue text
    },
    rememberContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    rememberText: {
        color: "#1565C0", // Medium blue text
        marginLeft: 10,
    },
    button: {
        backgroundColor: "#0D47A1", // Strong blue button
        paddingVertical: 15,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    forgotText: {
        color: "#1565C0", // Medium blue
        marginVertical: 10,
        marginBottom: 50,
    },
    signupText: {
        color: "#0D47A1", // Deep blue text
        marginTop: 10,
        textAlign: "center",
    },
});

export default LoginScreen;