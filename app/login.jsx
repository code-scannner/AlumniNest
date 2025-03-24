import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { Link, useRouter, Stack } from "expo-router";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";
import axios from "axios";
import * as secureStore from "expo-secure-store";

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Missing fields", "Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("http://192.168.0.140:5000/api/login", {
                email,
                password,
            });
            const { token, user } = response.data;
            console.log(token)
            await secureStore.setItemAsync("token", token);
            router.push("/(tabs)/profile");
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Login Failed", error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-primary-dark p-5">
            {/* Back Button */}
            <Stack.Screen options={{ headerShown: false }} />
            <Pressable className="absolute top-10 left-5" onPress={() => router.push("/")}> 
                <Feather name="arrow-left" size={24} color="white" />
            </Pressable>

            {/* Title */}
            <Text className="text-5xl font-bold italic text-primary-600 mb-4">Alumni <Text className="text-primary-500">Nest</Text></Text>
            <Text className="text-lg text-primary-400 mb-5">Log in to your account</Text>

            {/* Email Input */}
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="envelope" size={20} color="white" className="mr-2" />
                <TextInput
                    className="flex-1 text-white"
                    placeholder="Email Address"
                    placeholderTextColor="#bbb"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="lock" size={20} color="white" className="mr-2" />
                <TextInput
                    className="flex-1 text-white"
                    placeholder="Password"
                    placeholderTextColor="#bbb"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="white" />
                </Pressable>
            </View>

            {/* Log In Button */}
            <Pressable
                className="bg-primary-400 py-3 rounded-lg w-11/12 items-center mt-3"
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="text-black text-lg font-bold">LOG IN</Text>
                )}
            </Pressable>

            {/* Forgot Password & Sign Up Links */}
            <Link href="/forgot-password" asChild>
                <Pressable>
                    <Text className="text-primary-300 mt-4">Forgot Password?</Text>
                </Pressable>
            </Link>

            <Text className="text-white mt-5">
                Don’t have an account?
                <Link href="/signup"><Text className="text-primary-300"> Sign up</Text></Link>
            </Text>
        </View>
    );
};

export default LoginScreen;
