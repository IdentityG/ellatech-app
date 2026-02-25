import React from "react";
import { View, Text } from "react-native";

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

const EmptyState = ({ icon = "📭", title, subtitle }: Props) => {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-gray-700 text-lg font-semibold text-center">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-gray-400 text-sm text-center mt-2 px-8">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default EmptyState;