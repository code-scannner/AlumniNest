import React, { useState, useEffect } from "react";
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
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import axios from "axios";
import Loading from "@/components/Loading";
import Constants from "expo-constants";
export default function ConnectionsScreen() {
  const [requests, setRequests] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync("token");
        const response = await axios.get(
          "http://" +
            Constants.expoConfig.extra.baseurl +
            "/api/connect/requests",
          {
            headers: { token },
          }
        );
        setRequests(response.data.requests);
      } catch (error) {
        console.error("Error fetching network:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

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
          <Header title={"Requests"} showBackButton mb={10} />
        </View>
        <FlatList
          data={requests}
          keyExtractor={(item) => item?._id}
          renderItem={({ item }) => (
            <ProfileCard
              user={item}
              status={item.status}
              onPress={() => console.log(`${item.full_name} pressed`)}
              ShowRequestButton={true}
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
});
