import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ProfileCard from "../../components/ProfileCard";
import Header from "../../components/Header";
import { Icon } from "@/assets/icons";
import Feather from "@expo/vector-icons/Feather";
import ScreenWrapper from "../../components/ScreenWrapper";
import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Loading from "@/components/Loading";

export default function ConnectionsScreen() {
  const [search, setSearch] = useState("");
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reqCount, setReqCount] = useState(0);
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get(
          "http://" + Constants.expoConfig.extra.baseurl + "/api/connect/",
          {
            headers: { token },
          }
        );
        setNetwork(response.data.connections);
      } catch (error) {
        console.error("Error fetching network:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const getRequestCount = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.get(
        "http://" +
          Constants.expoConfig.extra.baseurl +
          "/api/connect/requests/count",
        {
          headers: {
            token,
          },
        }
      );
      setReqCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch notification count:", error.message);
    }
  };
  useEffect(() => {
    getRequestCount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getRequestCount();
    }, [])
  );
  const filteredUsers = network.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    );
  }
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
            {reqCount > 0 && (
              <>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{reqCount}</Text>
                </View>
              </>
            )}
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
          keyExtractor={(item) => item?._id}
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
  userplus: {
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
  pill: {
    position: "absolute",
    right: -4,
    top: -45,
    backgroundColor: theme.colors.roseLight,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: hp(2),
    height: hp(2),
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: "bold",
  },
});
