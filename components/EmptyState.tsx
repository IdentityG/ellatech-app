import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

const EmptyState = ({ icon = "📭", title, subtitle }: Props) => {
  return (
    <View
      className="bg-white rounded-3xl p-8 items-center border border-gray-100 mx-4 mt-6"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={["#f3f4f6", "#e5e7eb"]}
        className="w-24 h-24 rounded-full items-center justify-center mb-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text className="text-5xl">{icon}</Text>
      </LinearGradient>

      <Text className="text-gray-900 text-xl font-bold text-center">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-gray-500 text-sm text-center mt-2 leading-relaxed px-4">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default EmptyState;