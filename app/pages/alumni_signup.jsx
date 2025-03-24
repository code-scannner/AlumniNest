import React, { useState } from "react";
import { View, Text,Image, TextInput, Pressable, ScrollView,Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import { SimpleLineIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const SignupScreen = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [currentCompany, setCurrentCompany] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [batchYear, setBatchYear] = useState("");
    const years = Array.from({ length: 20 }, (_, i) => (2005 + i).toString());

    // function to select photo
    const [profilePhoto, setProfilePhoto] = useState(null);
    const handlePhotoUpload = async () => {
    if (Platform.OS === "web") {
        // Create a native file input for web
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfilePhoto(url);
        }
        };
        input.click();
    } else {
        // For native platforms (iOS/Android), use expo-image-picker
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });
        if (!result.canceled) {
        setProfilePhoto(result.assets[0].uri);
        }
    }
    };
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#121212" }}>
            {/* Back Button */}
            <Pressable className="absolute top-10 left-5 mt-7" onPress={() => {
              router.push("/")}}> 
                <Feather name="arrow-left" size={24} color="white" />
            </Pressable>

            {/* Title */}
            <Text className="text-3xl font-bold italic text-primary-600 mb-4 mt-10">Sign up as <Text className="text-primary-500">Alumni</Text></Text>
            <Text className="text-lg text-primary-400 mb-5">Create your account</Text>

            {/* Input Fields */}
            <Pressable onPress={handlePhotoUpload} style={{ marginBottom: 16 }}>
                {profilePhoto ? (
                    <Image
                    source={{ uri: profilePhoto }}
                    style={{ width: 96, height: 96, borderRadius: 48 }}
                    />
                ) : (
                    <View
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        backgroundColor: "#666",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                    <Feather name="camera" size={30} color="white" />
                    </View>
                )}
            </Pressable>
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
                <SimpleLineIcons name="social-linkedin" size={18} color="white" className="mr-2" />
                <TextInput className="flex-1 text-white" placeholder="LinkedIn Profile" placeholderTextColor="#bbb" value={linkedin} onChangeText={setLinkedin} />
            </View>
            {/* Dropdown: Batch Year */}
            <View className="bg-primary-999 rounded-lg w-11/12 mb-4 py-3 flex-row items-center px-4">
                <SimpleLineIcons name="calendar" size={20} color="white" className="mr-1"/>
                <View className="flex-1">
                    <SelectList
                    setSelected={setBatchYear}
                    data={years.map((y) => ({ key: y, value: y }))}
                    placeholder="Batch Year"
                    onFocus={() => setActiveDropdown("BatchYear")}
                    onBlur={() => setActiveDropdown(null)}
                    boxStyles={{ backgroundColor: "transparent", borderWidth: 0 }}
                    inputStyles={{ color: "#ffffff" }}
                    dropdownTextStyles={{ color: "#ffffff" }}
                    arrowicon={<Feather name="chevron-down" size={20} color="#ffffff" />}
                    closeicon={<Feather name="x" size={20} color="#ffffff" />}
                    searchicon={<Feather name="search" size={20} color="#ffffff" />}
                    />
                </View>
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