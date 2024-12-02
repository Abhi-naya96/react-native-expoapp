import { ActivityIndicator, Text, View } from "react-native";
import React from "react";

export default function StartPage () {
  return (
    <View
      className="flex-1 justify-center item-center">
      {/* <Text className="text-2xl text-center">Home</Text> */}
      <ActivityIndicator size="large" color="grey"></ActivityIndicator>
    </View>
  );
}
