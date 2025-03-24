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
  const [rollNumber, setRollNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [branch, setBranch] = useState("Computer Science");
  const [semester, setSemester] = useState("1");
  const [course, setCourse] = useState("BTech");
  const [graduationYear, setGraduationYear] = useState("");
  const [resume, setResume] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
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
  const branches = [
    "Computer Science",
    "Mechanical",
    "Civil",
    "Electrical",
    "ECE",
    "AIDS",
    "VLSI",
  ];
  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());
  const courses = ["BTech", "MTech", "MBA", "PhD"];
  const years = Array.from({ length: 20 }, (_, i) => (2005 + i).toString());

  return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#121212" }}>
        {/* Back Button positioned a bit higher */}
        <Pressable className="absolute top-7 left-5 mt-9" onPress={() => {
          router.push("/")}}> 
            <Feather name="arrow-left" size={24} color="white" />
        </Pressable>

        {/* Title */}
        <Text className="text-3xl font-bold italic text-primary-600 mb-4 mt-10">Sign up as <Text className="text-primary-500">Student</Text></Text>
        <Text className="text-lg text-primary-400 mb-5">Create your account</Text>
        {/* Input Fields & Dropdowns */}
          {/* Profile Photo Upload */}
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
          {/* Full Name */}
          <View className="flex-row items-center bg-primary-999 px-4 py-2  rounded-lg w-11/12 mb-4">
              <SimpleLineIcons name="user" size={20} color="white" className="mr-2" />
              <TextInput className="flex-1 text-white" placeholder="Full Name" placeholderTextColor="#bbb" value={fullName} onChangeText={setFullName} />
          </View>
          {/* Email */}
          <View className="flex-row items-center bg-primary-999 px-4 py-2 rounded-lg w-11/12 mb-4">
              <SimpleLineIcons name="envelope" size={20} color="white" className="mr-2" />
              <TextInput className="flex-1 text-white" placeholder="Email Address" placeholderTextColor="#bbb" value={email} onChangeText={setEmail} />
          </View>
          {/* Roll Number */}
          <View className="flex-row items-center bg-primary-999 px-4 py-2 rounded-lg w-11/12 mb-4">
              <FontAwesome name="id-card" size={20} color="white" className="mr-2" />
              <TextInput keyboardType="numeric" className="flex-1 text-white" placeholder="Roll Number" placeholderTextColor="#bbb" value={rollNumber} onChangeText={setRollNumber} />
          </View>
          {/* Mobile Number */}
          <View className="flex-row items-center bg-primary-999 px-4 py-2 rounded-lg w-11/12 mb-4">
              <FontAwesome name="phone" size={20} color="white" className="mr-2" />
              <TextInput keyboardType="numeric" className="flex-1 text-white" placeholder="Mobile Number" placeholderTextColor="#bbb" value={mobileNumber} onChangeText={setMobileNumber} />
          </View>
          {/* LinkedIn Profile */}
          <View className="flex-row items-center bg-primary-999 px-4 py-2 rounded-lg w-11/12 mb-4">
              <SimpleLineIcons name="social-linkedin" size={18} color="white" className="mr-2" />
              <TextInput className="flex-1 text-white" placeholder="LinkedIn Profile" placeholderTextColor="#bbb" value={linkedin} onChangeText={setLinkedin} />
          </View>
          {/* CGPA */}
          <View className="flex-row items-center bg-primary-999 px-4 py-2 rounded-lg w-11/12 mb-4">
            <FontAwesome name="book" size={20} color="white" className="mr-2" />
              <TextInput keyboardType="decimal-pad" className="flex-1 text-white" placeholder="CGPA" placeholderTextColor="#bbb" value={cgpa} onChangeText={setCgpa} />
          </View>

          {/* Dropdown: Branch */}
          <View className="bg-primary-999 rounded-lg w-11/12 mb-4 py-1">
            <SelectList
              setSelected={setBranch}
              data={branches.map((b) => ({ key: b, value: b }))}
              placeholder="Select Branch"
              onFocus={() => setActiveDropdown("branch")}
              onBlur={() => setActiveDropdown(null)}
              boxStyles={{ backgroundColor: "transparent", borderWidth: 0 }}
              inputStyles={{ color: "#ffffff" }}
              dropdownTextStyles={{ color: "#ffffff" }}
              arrowicon={<Feather name="chevron-down" size={20} color="#ffffff" />}
              closeicon={<Feather name="x" size={20} color="#ffffff" />}
              searchicon={<Feather name="search" size={20} color="#ffffff" />}
            />
          </View>

          {/* Dropdown: Semester */}
          <View className="bg-primary-999 rounded-lg w-11/12 mb-4 py-1">
            <SelectList
              setSelected={setSemester}
              data={semesters.map((s) => ({ key: s, value: s }))}
              placeholder="Select Semester"
              onFocus={() => setActiveDropdown("semester")}
              onBlur={() => setActiveDropdown(null)}
              boxStyles={{ backgroundColor: "transparent", borderWidth: 0 }}
              inputStyles={{ color: "#ffffff" }}
              dropdownTextStyles={{ color: "#ffffff" }}
              arrowicon={<Feather name="chevron-down" size={20} color="#ffffff" />}
              closeicon={<Feather name="x" size={20} color="#ffffff" />}
              searchicon={<Feather name="search" size={20} color="#ffffff" />}
            />
          </View>

          {/* Dropdown: Course */}
          <View className="bg-primary-999 w-11/12 rounded-lg mb-4 py-1">
            <SelectList
              setSelected={setCourse}
              data={courses.map((c) => ({ key: c, value: c }))}
              placeholder="Select Course"
              onFocus={() => setActiveDropdown("course")}
              onBlur={() => setActiveDropdown(null)}
              boxStyles={{ backgroundColor: "transparent", borderWidth: 0 }}
              inputStyles={{ color: "#ffffff" }}
              dropdownTextStyles={{ color: "#ffffff" }}
              arrowicon={<Feather name="chevron-down" size={20} color="#ffffff" />}
              closeicon={<Feather name="x" size={20} color="#ffffff" />}
              searchicon={<Feather name="search" size={20} color="#ffffff" />}
            />
          </View>

          {/* Dropdown: Graduation Year */}
          <View className="bg-primary-999 rounded-lg w-11/12 mb-4 py-1">
            <SelectList
              setSelected={setGraduationYear}
              data={years.map((y) => ({ key: y, value: y }))}
              placeholder="Select Graduation Year"
              onFocus={() => setActiveDropdown("graduationYear")}
              onBlur={() => setActiveDropdown(null)}
              boxStyles={{ backgroundColor: "transparent", borderWidth: 0 }}
              inputStyles={{ color: "#ffffff" }}
              dropdownTextStyles={{ color: "#ffffff" }}
              arrowicon={<Feather name="chevron-down" size={20} color="#ffffff" />}
              closeicon={<Feather name="x" size={20} color="#ffffff" />}
              searchicon={<Feather name="search" size={20} color="#ffffff" />}
            />
          </View>

          {/* Create Account Button */}
          <Pressable
            className="bg-primary-400 py-3 rounded-lg w-11/12 items-center mt-3"
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text className="text-black text-lg font-bold">CREATE ACCOUNT</Text>
          </Pressable>

        {/* Footer */}
        <View className="mt-5 flex-row justify-center">
          <Text className="text-white">Already have an account? </Text>
          <Link href="/login" className="text-blue-400 font-semibold">
            Sign in
          </Link>
        </View>
      </ScrollView>
  );
};

export default SignupScreen;

