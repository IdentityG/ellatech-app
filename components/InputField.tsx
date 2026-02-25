import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const InputField = ({ label, error, ...rest }: Props) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-1">{label}</Text>
      <TextInput
        className={`border rounded-xl px-4 py-3 text-gray-900 bg-white text-base ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
      {error ? (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
};

export default InputField;