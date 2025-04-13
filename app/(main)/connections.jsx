import React, { useState } from "react";
import { View, TextInput, FlatList, StyleSheet } from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ProfileCard from "../../components/ProfileCard";

const mockUsers = [
  {
    id: 1,
    full_name: "Utkarsh Trivedi",
    username: "utkarsh_t",
    profile_pic: "https://i.pravatar.cc/300?img=1",
    status: "connect"
  },
  {
    id: 2,
    full_name: "Aadhya Gaur",
    username: "aadhya_123",
    profile_pic: "https://i.pravatar.cc/300?img=2",
    status: "pending"
  },
  {
    id: 3,
    full_name: "Dev Mehta",
    username: "devmehta",
    profile_pic: "https://i.pravatar.cc/300?img=3",
    status: "remove"
  }
];

export default function ConnectionsScreen() {
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.full_name.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by name or username"
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProfileCard
            user={item}
            status={item.status}
            onPress={() => console.log(`${item.full_name} pressed`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: hp(10), gap: hp(2), paddingHorizontal: wp(4), paddingTop: hp(2) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  searchBar: {
    marginTop: hp(2),
    marginHorizontal: wp(4),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderRadius: theme.radius.md,
    backgroundColor: "#f0f0f0",
    fontSize: hp(2),
    color: theme.colors.text
  }
});
