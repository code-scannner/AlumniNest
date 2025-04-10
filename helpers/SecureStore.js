import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store'
export async function save(key, value) {
    try {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value.toString());
        }
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

export async function getValueFor(key) {
    try {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
    }
}