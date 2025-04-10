import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const hp = (percentage: any) => {
  return (height * percentage) / 100;
};

export const wp = (percentage: any) => {
  return (width * percentage) / 100;
};