import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ProfileCard from "../../components/ProfileCard";
import Header from "../../components/Header";
import { Icon } from "@/assets/icons";
import Feather from "@expo/vector-icons/Feather";
import ScreenWrapper from "../../components/ScreenWrapper";
import { router } from "expo-router";
const mockUsers = [
  {
    id: 1,
    full_name: "Utkarsh Trivedi",
    username: "utkarsh_t",
    profile_pic: "https://i.pravatar.cc/300?img=1",
    status: "connect",
  },
  {
    id: 2,
    full_name: "Aadhya Gaur",
    username: "aadhya_123",
    profile_pic: "https://i.pravatar.cc/300?img=2",
    status: "pending",
  },
  {
    id: 3,
    full_name: "Dev Mehta",
    username: "devmehta",
    profile_pic: "https://i.pravatar.cc/300?img=3",
    status: "remove",
  },
];

export default function ConnectionsScreen() {
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <View style={{ paddingHorizontal: wp(4) }}>
          <Header title={"Network"} showBackButton mb={10} />
          <TouchableOpacity onPress={() => router.push("/(main)/connections")}>
            <Feather
              name="users"
              size={hp(3)}
              color={theme.colors.text}
              style={styles.user}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(main)/requestPage")}>
            <Feather
              name="user-plus"
              size={hp(3)}
              color={theme.colors.text}
              style={styles.userplus}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search by name or username"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProfileCard
              user={item}
              status={item.status}
              button={true}
              onPress={() => console.log(`${item.full_name} pressed`)}
            />
          )}
          contentContainerStyle={{
            paddingBottom: hp(2),
            paddingHorizontal: wp(4),
            paddingTop: hp(2),
          }}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: wp(1),
  },
  welcomeText: {
    marginTop: hp(3),
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  user: {
    position: "absolute",
    right: 40,
    top: -35,
  },
  userplus:
  {
    position: "absolute",
    right: 0,
    top: -35,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fff",
    borderRadius: 10,
    paddingHorizontal: wp(3),
    marginHorizontal: wp(4),
    height: hp(5.5),
    borderWidth: 1,
    marginTop: hp(2),
    borderColor: "#ccc",
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
});
