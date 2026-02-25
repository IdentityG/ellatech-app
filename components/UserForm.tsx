import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import InputField from "./InputField";
import { useApp } from "../context/AppContext";
import { validateEmail } from "../utils/helpers";

const UserForm = () => {
  const { registerUser } = useApp();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; fullName?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      const result = registerUser(email, fullName);
      setLoading(false);

      if (result.success) {
        Alert.alert("✅ Success", result.message);
        setEmail("");
        setFullName("");
        setErrors({});
      } else {
        Alert.alert("❌ Error", result.message);
      }
    }, 600);
  };

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm mx-4 mt-4">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Register New User
      </Text>

      <InputField
        label="Full Name"
        placeholder="e.g. Egnuma Gelana"
        value={fullName}
        onChangeText={(t) => {
          setFullName(t);
          if (errors.fullName) setErrors((e) => ({ ...e, fullName: undefined }));
        }}
        error={errors.fullName}
        autoCapitalize="words"
      />

      <InputField
        label="Email Address"
        placeholder="e.g. egnuma@email.com"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-indigo-600 rounded-xl py-3 items-center mt-2"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">Register User</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UserForm;