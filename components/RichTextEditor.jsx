import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  actions,
  RichEditor,
  RichToolbar
} from "react-native-pell-rich-editor";
import { theme } from "@/constants/theme";

export default function RichTextEditor({ editorRef, onChange }) {
  return (
    <View
      style={{
        minHeight: 285
      }}
    >
      <RichToolbar
        actions={[
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertVideo,
          actions.checkboxList,
          actions.undo,
          actions.redo,
          actions.heading1,
          actions.heading4
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H4</Text>
          )
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        editor={editorRef}
        disabled={false}
        selectedIconTint={theme.colors.primary}
      />

      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder="Whats on your mind?"
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.darkLight
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    padding: 5,
    borderColor: theme.colors.gray
  },
  contentStyle: {
    color: theme.colors.textDark
    // placeholderColor: "gray"
  }
});