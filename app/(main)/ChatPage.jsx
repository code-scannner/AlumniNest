import React, { useState } from "react";
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
} from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import EmojiSelector from "react-native-emoji-selector";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const initialMessages = [
  { id: "1", text: "Hey there!", time: "10:20 AM", sender: true, date: "Today" },
  { id: "2", text: "Hi! How can I help you?", time: "10:21 AM", sender: false, date: "Today" },
  { id: "3", text: "I'm interested in your career journey.", time: "10:22 AM", sender: true, date: "Today" },
  { id: "4", text: "That's great! I'm happy to share.", time: "10:23 AM", sender: false, date: "Yesterday" },
];

const ChatMessage = ({ text, time, sender }) => (
  <View style={[styles.messageContainer, sender ? styles.messageRight : styles.messageLeft]}>
    <Text style={styles.messageText}>{text}</Text>
    <View style={styles.messageFooter}>
      <Text style={styles.messageTime}>{time}</Text>
    </View>
  </View>
);

const ChatPage = () => {
  const [messages, setMessages] = useState(initialMessages.reverse());
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: (messages.length + 1).toString(),
        text: newMessage,
        time: "Just now",
        sender: true,
        date: "Today", // mock
      };
      setMessages([newMsg, ...messages]);
      setNewMessage("");
    }
  };

  const renderItem = ({ item, index }) => {
    const prevMsg = messages[index + 1];
    const showDate = !prevMsg || prevMsg.date !== item.date;

    return (
      <>
        {showDate && (
          <View style={styles.dateDivider}>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        )}
        <ChatMessage text={item.text} time={item.time} sender={item.sender} />
      </>
    );
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/student.jpg")}
            style={styles.avatarImage}
          />
          <Text style={styles.username}>Alumni Name</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 12, paddingVertical: 10 }}
          inverted
        />

        {/* Emoji Picker */}
        {showEmojiPicker && (
            <View style={{ height: hp(35), backgroundColor: "#fff" }}>
                <EmojiSelector
                onEmojiSelected={handleEmojiSelect}
                showSearchBar={false}
                showTabs={true}
                columns={8}
                />
            </View>
        )}


        {/* Input Bar */}
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={80}
            >
            <View style={styles.inputBar}>
                {/* <Pressable onPress={() => setShowEmojiPicker(prev => !prev)}>
                <MaterialCommunityIcons name="emoticon-outline" size={26} color={theme.colors.textLight} />
                </Pressable> */}

                <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message"
                style={styles.input}
                multiline
                />

                <Pressable onPress={sendMessage}>
                <MaterialCommunityIcons name="send" size={24} color={theme.colors.primary} />
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
    gap: wp(3),
    marginBottom: hp(2),
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
    maxWidth: "75%",
    padding: wp(3),
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.grayLight,
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#E0E0E0",
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  messageText: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontWeight: "500",
  },
  messageFooter: {
    marginTop: hp(0.5),
    alignItems: "flex-end",
  },
  messageTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
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
