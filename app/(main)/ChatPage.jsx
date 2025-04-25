import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
} from "react-native";
import BackButton from "../../components/BackButton";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import EmojiSelector from "react-native-emoji-selector";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { io } from "socket.io-client";
import { router } from "expo-router";
import Loading from "@/components/Loading";

const socket = io("http://" + Constants.expoConfig.extra.baseurl);
const ChatMessage = ({ text, time, sender_id, current_user }) => (
  <View
    style={[
      styles.messageContainer,
      sender_id === current_user ? styles.messageRight : styles.messageLeft,
    ]}
  >
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{text}</Text>
      <Text style={styles.messageTime}>{moment(time).format("MMM D")}</Text>
    </View>
  </View>
);

const ChatPage = () => {
  const { chat_id } = useLocalSearchParams();
  const [other, setOther] = useState();
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [type, setType] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const [loading, isLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingOpacity = useState(new Animated.Value(0))[0];

  const showTyping = () => {
    Animated.timing(typingOpacity, {
      toValue: 1,
      duration: 300, // fade-in duration
      useNativeDriver: true,
    }).start();
  };

  const hideTyping = () => {
    Animated.timing(typingOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fetchUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) throw new Error("No token found");

      const response = await axios.get(
        "http://" + Constants.expoConfig.extra.baseurl + "/api/profile",
        {
          headers: { token: `${token}` },
        }
      );

      setUser(response.data.info);
      setType(response.data.type);
    } catch (error) {
      console.error("Failed to fetch user:", error.message);
    }
  };

  useEffect(() => {
    if (!chat_id || !user) return;

    socket.emit("joinRoom", chat_id);
    console.log(`Joined room: ${chat_id}`);

    loadMessages();
    socket.on("receiveMessage", (newMessage) => {
      setIsTyping(false);
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    socket.on("userTyped", () => {
      // setIsTyping(true);
      console.log("User Typed");
      // setTimeout(() => setIsTyping(false), 1500);
      showTyping();
      setTimeout(() => hideTyping(), 1500);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyped");
      socket.emit("leaveRoom", chat_id); // Ensure user leaves room on unmount
    };
  }, [chat_id, user]);

  // Scroll to bottom when messages update
  // useEffect(() => {
  //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const sendMessage = () => {
    console.log(newMessage);
    if (!newMessage.trim() || !user) return;
    const newMsg = {
      chat_id,
      sender_id: user._id,
      senderModel: type,
      content: newMessage,
    };

    socket.emit("sendMessage", newMsg);
    setNewMessage("");
  };
  const loadMessages = async () => {
    try {
      isLoading(true);
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.get(
        "http://" +
          Constants.expoConfig.extra.baseurl +
          `/api/chat/messages/${chat_id}`,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setMessages(response.data.messages.reverse());
        setOther(response.data.chatPerson);
        readAll();
      }
    } catch (error) {
      console.error("Error fetching network:", error);
    } finally {
      isLoading(false);
    }
  };

  const readAll = async () => {
    try {
      console.log("Reading all msgs..");
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.put(
        "http://" +
          Constants.expoConfig.extra.baseurl +
          `/api/chat/readall/${chat_id}`,
        {},
        {
          headers: { token },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching network:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const renderItem = ({ item, index }) => {
    return (
      <>
        <ChatMessage
          text={item.content}
          time={item.timestamp}
          sender_id={item.sender_id}
          current_user={user._id}
        />
      </>
    );
  };

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
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.username}>{other?.full_name}</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(main)/userProfile",
                params: { user_id: other?._id },
              })
            }
          >
            <Image
              source={{
                uri:
                  other?.profile_pic ||
                  "https://fra.cloud.appwrite.io/v1/storage/buckets/67f8e53c0001a80cdbde/files/680565aa00223ec57c6d/view?project=67f8e5020020502a85c0&mode=admin",
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 12, paddingVertical: 10 }}
          inverted
        />
        {/* Input Bar */}
        {/* {isTyping && <Text style={styles.typingText}>Typing...</Text>} */}
        <Animated.View style={{ opacity: typingOpacity }}>
          <Text style={styles.typingText}>Typing...</Text>
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <View style={styles.inputBar}>
            <TextInput
              value={newMessage}
              onChangeText={(text) => {
                setNewMessage(text);
                socket.emit("userTyping", chat_id);
              }}
              placeholder="Type a message"
              placeholderTextColor="gray"
              style={styles.input}
              multiline
            />

            <Pressable onPress={sendMessage}>
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  typingText: {
    fontSize: hp(1.8),
    fontStyle: "italic",
    color: theme.colors.textLight,
    marginLeft: wp(2),
    marginBottom: hp(0.5),
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  username: {
    fontSize: hp(2.3),
    fontWeight: "600",
    color: theme.colors.text,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderWidth: 3,
    borderColor: theme.colors.gray,
  },
  messageContainer: {
    maxWidth: "80%",
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(1),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.grayLight,
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: "hsla(212, 100.00%, 85.10%, 0.70)",
  },
  messageText: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontWeight: "400",
    alignSelf: "flex-start",
  },
  messageFooter: {
    marginTop: hp(0.5),
    alignItems: "flex-end",
  },
  messageTime: {
    fontSize: hp(1.1),
    color: theme.colors.textLight,
    alignSelf: "flex-end",
  },
  dateDivider: {
    alignItems: "center",
    marginVertical: hp(1),
  },
  dateText: {
    fontSize: hp(2),
    fontWeight: "600",
    color: theme.colors.textLight,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray,
    gap: 10,
    backgroundColor: "white",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: hp(1.9),
    color: theme.colors.text,
    paddingVertical: 8,
  },
  emojiPicker: {
    height: hp(35),
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: theme.colors.gray,
  },
});
