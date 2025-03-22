import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { SimpleLineIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import * as DocumentPicker from "expo-document-picker";

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

  const handleResumeUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.type !== "cancel") {
      setResume(result.uri);
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-primary-dark">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        {/* Back Button positioned a bit higher */}
        <Pressable className="absolute top-7 left-5" onPress={() => {
          router.push("/")}}> 
            <Feather name="arrow-left" size={24} color="white" />
        </Pressable>

        {/* Title */}
        <Text className="text-3xl font-bold italic text-blue-600 text-center">
          Sign Up as <Text className="text-blue-500">Student</Text>
        </Text>

        {/* Input Fields & Dropdowns */}
        <View className="mt-8 w-full space-y-6">
          {/* Full Name */}
          <View className="flex-row items-center bg-primary-999 border border-blue-500 px-4 py-3 rounded-lg">
            <SimpleLineIcons name="user" size={20} color="white" className="mr-2" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Full Name"
              placeholderTextColor="#bbb"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          {/* Email */}
          <View className="flex-row items-center bg-primary-999 border border-blue-500 px-4 py-3 rounded-lg">
            <SimpleLineIcons name="envelope" size={20} color="white" className="mr-2" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Email Address"
              placeholderTextColor="#ffffff"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          {/* Roll Number */}
          <View className="flex-row items-center bg-primary-999 border border-blue-500 px-4 py-3 rounded-lg">
            <FontAwesome name="id-card" size={20} color="white" className="mr-2" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Roll Number"
              placeholderTextColor="#bbb"
              value={rollNumber}
              onChangeText={setRollNumber}
              keyboardType="numeric"
            />
          </View>
          {/* Mobile Number */}
          <View className="flex-row items-center bg-primary-999 border border-blue-500 px-4 py-3 rounded-lg">
            <SimpleLineIcons name="phone" size={20} color="white" className="mr-2" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Mobile Number"
              placeholderTextColor="#ffffff"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="numeric"
            />
          </View>
          {/* LinkedIn Profile */}
          <View className="flex-row items-center bg-primary-999 border border-blue-500 px-4 py-3 rounded-lg">
            <SimpleLineIcons name="social-linkedin" size={20} color="white" className="mr-2" />
            <TextInput
              className="flex-1 text-white"
              placeholder="LinkedIn Profile"
              placeholderTextColor="#ffffff"
              value={linkedin}
              onChangeText={setLinkedin}
            />
          </View>
          {/* CGPA */}
          <View className="flex-row items-center bg-primary-999 border border-blue-500 px-4 py-3 rounded-lg">
            <FontAwesome name="book" size={20} color="white" className="mr-2" />
            <TextInput
              className="flex-1 text-white"
              placeholder="CGPA"
              placeholderTextColor="#ffffff"
              value={cgpa}
              onChangeText={setCgpa}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Dropdown: Branch */}
          <Text className="text-gray-300 ml-1">Branch</Text>
          <View className="bg-primary-999 border border-blue-500 rounded-lg mb-4">
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
          <Text className="text-gray-300 ml-1">Semester</Text>
          <View className="bg-primary-999 border border-blue-500 rounded-lg mb-4">
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
          <Text className="text-gray-300 ml-1">Course</Text>
          <View className="bg-primary-999 border border-blue-500 rounded-lg mb-4">
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
          <Text className="text-gray-300 ml-1">Graduation Year</Text>
          <View className="bg-primary-999 border border-blue-500 rounded-lg mb-4">
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
            className="bg-primary-400 py-3 rounded-lg w-full items-center mt-3"
            onPress={() => router.push("/pages/profile")}
          >
            <Text className="text-black text-lg font-bold">CREATE ACCOUNT</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="mt-5 flex-row justify-center">
          <Text className="text-white">Already have an account? </Text>
          <Link href="/login" className="text-blue-400 font-semibold">
            Sign in
          </Link>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignupScreen;

