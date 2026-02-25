import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

const InputField = ({ label, error, ...rest }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-semibold text-sm mb-2 ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-2xl px-4 border-2 ${error
            ? "border-red-300 bg-red-50"
            : focused
              ? "border-teal-400 bg-teal-50/30"
              : "border-gray-200 bg-gray-50"
          }`}
        style={{
          shadowColor: focused ? "#0d9488" : "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: focused ? 0.15 : 0,
          shadowRadius: 8,
          elevation: focused ? 3 : 0,
        }}
      >
        <TextInput
          className="flex-1 text-gray-800 text-base py-4"
          style={{ fontSize: 15 }}
          placeholderTextColor="#c0c4cc"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {rest.value && rest.value.length > 0 && !error && (
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
        )}
        {error && (
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
        )}
      </View>

      {error ? (
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="warning-outline" size={12} color="#ef4444" />
          <Text className="text-red-500 text-xs font-medium ml-1">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default InputField;