import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { SelectList } from "react-native-dropdown-select-list";


const EditProfileScreen = () => {
  const router = useRouter();

  // State for profile details
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [college, setCollege] = useState("");
  const [GradutaionYear, setGraduationYear] = useState("");
  const [bio, setBio] = useState("");


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
  // Fetch current profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get("http://192.168.0.140:5000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.info;
        setUsername(data.username);
        setEmail(data.email);
        setPhoneNo(data.phone_no);
        setCourse(data.course);
        setBranch(data.branch);
        setCollege(data.college);
        setPassoutYear(data.passout_year);
        setBio(data.bio);
        // If a profile photo URL is provided from the backend, set it
        if (data.profile_photo) {
          setProfilePhoto(data.profile_photo);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error.message);
      }
    };
    fetchProfile();
  }, []);

  // Photo upload handler
  const handlePhotoUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  // Save handler to update profile details on the backend
  const handleSave = async () => {
    const updatedData = {
      username,
      email,
      phone_no: phoneNo,
      course,
      branch,
      college,
      passout_year: passoutYear,
      bio,
      profile_photo: profilePhoto,
    };

    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.put(
        "http://192.168.0.140:5000/api/profile/update",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Profile updated:", response.data);
      router.push("/pages/profile");
    } catch (error) {
      console.error("Failed to update profile:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#121212" }}>
      {/* Profile Photo with Edit Option */}
      <View className="items-center mb-6 mt-6">
        <Pressable onPress={handlePhotoUpload}>
          {profilePhoto ? (
            <Image
              source={{ uri: profilePhoto }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center">
              <Feather name="camera" size={30} color="white" />
            </View>
          )}
        </Pressable>
        <Text className="text-white mt-2">Tap to update photo</Text>
      </View>

      {/* Editable Fields */}
      <View className="mb-4  px-4">
        <Text className="text-white  mb-1 px-1">Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#bbb"
          className="bg-primary-999 px-4 py-3 rounded-lg text-white"
        />
      </View>

      <View className="mb-4 px-4">
        <Text className="text-white   mb-1 px-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#bbb"
          className="bg-primary-999 px-4 py-3 rounded-lg text-white"
          keyboardType="email-address"
        />
      </View>

      <View className="mb-4 px-4">
        <Text className="text-white   mb-1 px-1">Phone</Text>
        <TextInput
          value={phoneNo}
          onChangeText={setPhoneNo}
          placeholder="Phone"
          placeholderTextColor="#bbb"
          className="bg-primary-999 px-4 py-3 rounded-lg text-white"
          keyboardType="phone-pad"
        />
      </View>

      {/* courses */}
      <View className=" px-4">
        <Text className="text-white  mb-1 px-1">Course</Text>
        <View className="bg-primary-999 rounded-lg mb-4 w-full">
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
      </View>
      {/* branch */}
      <View className="px-4">
        <Text className="text-white  mb-1 px-1">Branch</Text>
        <View className="bg-primary-999 rounded-lg w-full mb-4">
          <SelectList
            setSelected={(val) => setBranch(val)}
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
      </View>
      {/* Graduation Year */}
      <View className=" px-4">
        <Text className="text-white  mb-1 px-1">Graduation Year</Text>
          <View className="bg-primary-999 rounded-lg w-full mb-4">
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
      </View>

      <View className="px-4 mb-3">
        <Text className="text-white  mb-1 px-1">Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Bio"
          placeholderTextColor="#bbb"
          className="bg-primary-999 px-4 py-4 rounded-lg text-white"
          multiline={true}
        />
      </View>

      {/* Update Button */}
      <Pressable
        onPress={handleSave}
        className="bg-primary-400 py-3 px-3 ml-4 rounded-lg w-11/12 items-center mt-4"
      >
        <Text className="text-black  font-bold">UPDATE PROFILE</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditProfileScreen;
