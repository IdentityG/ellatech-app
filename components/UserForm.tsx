import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { validateEmail } from "../utils/helpers";

interface UserFormProps {
  onSuccess?: () => void;
}

const FloatingInput = ({
  label,
  icon,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "next",
  onSubmitEditing,
  inputRef,
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-semibold text-sm mb-2 ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-2xl px-4 border-2 ${
          error
            ? "border-red-300 bg-red-50"
            : focused
            ? "border-indigo-400 bg-indigo-50/30"
            : "border-gray-200 bg-gray-50"
        }`}
        style={{
          shadowColor: focused ? "#6366f1" : "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: focused ? 0.15 : 0,
          shadowRadius: 8,
          elevation: focused ? 3 : 0,
        }}
      >
        <View
          className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
            error
              ? "bg-red-100"
              : focused
              ? "bg-indigo-100"
              : "bg-gray-100"
          }`}
        >
          <Ionicons
            name={icon}
            size={18}
            color={error ? "#ef4444" : focused ? "#6366f1" : "#9ca3af"}
          />
        </View>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#c0c4cc"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-gray-800 text-base py-4"
          style={{ fontSize: 15 }}
        />

        {value.length > 0 && !error && (
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
        )}
        {error && (
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
        )}
      </View>

      {error && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="warning-outline" size={12} color="#ef4444" />
          <Text className="text-red-500 text-xs font-medium ml-1">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const { registerUser } = useApp();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    fullName?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    animateButton();

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      const result = registerUser(email, fullName);
      setLoading(false);

      if (result.success) {
        Alert.alert("🎉 Welcome!", result.message, [
          {
            text: "Great!",
            onPress: () => {
              setEmail("");
              setFullName("");
              setErrors({});
              onSuccess?.();
            },
          },
        ]);
      } else {
        Alert.alert("Oops!", result.message);
      }
    }, 600);
  };

  const isFormFilled = email.trim().length > 0 && fullName.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View>
     
        <FloatingInput
          label="Full Name"
          icon="person-outline"
          value={fullName}
          placeholder="e.g. Egnuma Gelana"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          onChangeText={(t: string) => {
            setFullName(t);
            if (errors.fullName)
              setErrors((e) => ({ ...e, fullName: undefined }));
          }}
          error={errors.fullName}
        />

        <FloatingInput
          label="Email Address"
          icon="mail-outline"
          value={email}
          placeholder="e.g. egnuma@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          inputRef={emailRef}
          onSubmitEditing={handleSubmit}
          onChangeText={(t: string) => {
            setEmail(t);
            if (errors.email)
              setErrors((e) => ({ ...e, email: undefined }));
          }}
          error={errors.email}
        />

    
        <Animated.View
          style={{ transform: [{ scale: buttonScale }] }}
          className="mt-2"
        >
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
            className={`rounded-2xl py-4 flex-row items-center justify-center ${
              isFormFilled
                ? "bg-indigo-600"
                : "bg-indigo-400"
            }`}
            style={{
              shadowColor: "#6366f1",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="#fff" size="small" />
                <Text className="text-white font-bold text-base ml-3">
                  Creating Account...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons
                  name="person-add"
                  size={20}
                  color="#fff"
                />
                <Text className="text-white font-bold text-base ml-2">
                  Register User
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View className="flex-row items-center justify-center mt-4">
          <Ionicons
            name="shield-checkmark-outline"
            size={14}
            color="#9ca3af"
          />
          <Text className="text-gray-400 text-xs ml-1.5">
            Your information is stored securely
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserForm;