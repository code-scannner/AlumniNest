import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";

const SignupScreen = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [currentCompany, setCurrentCompany] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [batchYear, setBatchYear] = useState("");

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#121212" }}>
            {/* Back Button */}
            <Pressable className="absolute top-10 left-5" onPress={() => {
              router.push("/")}}> 
                <Feather name="arrow-left" size={24} color="white" />
            </Pressable>

            {/* Title */}
            <Text className="text-3xl font-bold italic text-primary-600 mb-4">Sign up as <Text className="text-primary-500">Alumni</Text></Text>
            <Text className="text-lg text-primary-400 mb-5">Create your account</Text>

            {/* Input Fields */}
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="user" size={20} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="Full Name" placeholderTextColor="#bbb" value={fullName} onChangeText={setFullName} />
            </View>
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="envelope" size={20} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="Email Address" placeholderTextColor="#bbb" value={email} onChangeText={setEmail} />
            </View>
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="phone" size={20} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="Mobile Number" placeholderTextColor="#bbb" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="numeric" />
            </View>
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="briefcase" size={20} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="Current Company" placeholderTextColor="#bbb" value={currentCompany} onChangeText={setCurrentCompany} />
            </View>
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="user" size={20} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="Current Role" placeholderTextColor="#bbb" value={currentRole} onChangeText={setCurrentRole} />
            </View>
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="social-linkedin" size={20} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="LinkedIn Profile" placeholderTextColor="#bbb" value={linkedin} onChangeText={setLinkedin} />
            </View>
            <View className="flex-row items-center bg-primary-999 px-4 py-3 rounded-lg w-11/12 mb-4">
                <SimpleLineIcons name="calendar" size={20} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="Batch Year" placeholderTextColor="#bbb" value={batchYear} onChangeText={setBatchYear} keyboardType="numeric" />
            </View>

            {/* Create Account Button */}
            <Pressable className="bg-primary-400 py-3 rounded-lg w-11/12 items-center mt-3" onPress={() => router.push("/pages/profile")}> 
                <Text className="text-black text-lg font-bold">CREATE ACCOUNT</Text>
            </Pressable>

            {/* Footer */}
            <Text className="text-white mt-5">Already have an account?
                <Link href="/login"><Text className="text-primary-300"> Sign in</Text></Link>
            </Text>
        </ScrollView>
    );
};

export default SignupScreen;