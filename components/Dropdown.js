import {
    View,
    Text,
    Pressable,
    Modal,
    FlatList,
    StyleSheet,
    Dimensions,
  } from "react-native";
  import React, { useState } from "react";
  import { Ionicons } from "@expo/vector-icons";
  import { theme } from "@/constants/theme";
  
  const screenHeight = Dimensions.get("window").height;
  
  const Dropdown = ({ data, selected, onSelect, placeholder }) => {
    const [visible, setVisible] = useState(false);
  
    const handleSelect = (item) => {
      onSelect(item);
      setVisible(false);
    };
  
    return (
      <View style={styles.container}>
        <Pressable style={styles.dropdown} onPress={() => setVisible(true)}>
          <Text style={[styles.value, !selected && styles.placeholder]}>
            {selected || placeholder}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#999" />
        </Pressable>
  
        <Modal visible={visible} transparent animationType="fade">
          <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
            <View style={styles.modalContent}>
              <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable onPress={() => handleSelect(item)} style={styles.item}>
                    <Text>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  };
  
  export default Dropdown;
  
  const styles = StyleSheet.create({
    container: {
      width: "100%",
    },
    dropdown: {
      width: "100%",
      paddingHorizontal:20,
      paddingVertical: 14,
      borderWidth: 0.3,
      borderColor: "#000000",
      borderRadius: 22,
      backgroundColor: "#fff",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    value: {
      fontSize: 16,
      color: theme.colors.text,
    },
    placeholder: {
      color: "#999",
    },
    overlay: {
      flex: 1,
      backgroundColor: "#00000055",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: "#fff",
      maxHeight: screenHeight * 0.5,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    item: {
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
  });
  