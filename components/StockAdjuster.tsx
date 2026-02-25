import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import InputField from "./InputField";
import { useApp } from "../context/AppContext";

const StockAdjuster = () => {
  const { products, adjustStock, currentUser } = useApp();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = products.find((p) => p.id === selectedId) ?? null;

  const handleAdjust = (type: "ADD" | "REMOVE") => {
    if (!currentUser) {
      Alert.alert("No Session", "Register or log in first.");
      return;
    }
    if (!selectedId) {
      Alert.alert("No Product", "Please select a product.");
      return;
    }

    const num = parseInt(amount, 10);
    if (!amount.trim() || isNaN(num) || num <= 0) {
      setAmountError("Enter a valid amount greater than 0.");
      return;
    }
    setAmountError("");
    setLoading(true);

    setTimeout(() => {
      const result = adjustStock(selectedId, type, num);
      setLoading(false);

      if (result.success) {
        Alert.alert(
          type === "ADD" ? "Stock Added" : "Stock Removed",
          result.message
        );
        setAmount("");
      } else {
        Alert.alert("Error", result.message);
      }
    }, 500);
  };

  return (
    <View className="mx-4 mt-4">
      <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <Text className="text-base font-bold text-gray-800 mb-3">
          Select Product
        </Text>

        {products.length === 0 ? (
          <Text className="text-gray-400 text-sm">
            No products registered yet.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {products.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedId(p.id)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedId === p.id
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedId === p.id ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {p.sku}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {selected && (
        <View className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-4">
          <Text className="text-indigo-700 font-bold text-base">
            {selected.name}
          </Text>
          <Text className="text-indigo-500 text-sm mt-1">
            SKU: {selected.sku} · Current Stock:{" "}
            <Text className="font-bold">{selected.quantity}</Text>
          </Text>
        </View>
      )}

      <View className="bg-white rounded-2xl p-5 shadow-sm">
        <InputField
          label="Amount to Add / Remove"
          placeholder="Enter quantity"
          value={amount}
          onChangeText={(t) => {
            setAmount(t);
            if (amountError) setAmountError("");
          }}
          error={amountError}
          keyboardType="number-pad"
        />

        <View className="flex-row gap-3 mt-2">
          <TouchableOpacity
            onPress={() => handleAdjust("ADD")}
            disabled={loading || !selectedId}
            className={`flex-1 py-3 rounded-xl items-center ${
              !selectedId ? "bg-gray-200" : "bg-emerald-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">＋ Add</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAdjust("REMOVE")}
            disabled={loading || !selectedId}
            className={`flex-1 py-3 rounded-xl items-center ${
              !selectedId ? "bg-gray-200" : "bg-red-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">－ Remove</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StockAdjuster;