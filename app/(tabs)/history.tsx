import React from "react";
import { View, Text, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import TransactionList from "../../components/TransactionList";
import { useApp } from "../../context/AppContext";

export default function HistoryScreen() {
  const { transactions } = useApp();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <LinearGradient
        colors={["#3b82f6", "#2563eb", "#60a5fa"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 60,
          paddingBottom: 40,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View className="px-6 flex-row items-center justify-between">
          <View>
            <Text className="text-blue-100 text-sm font-medium">Activity Log</Text>
            <Text className="text-white text-3xl font-bold mt-1">History</Text>
          </View>
          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="time" size={24} color="#fff" />
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View className="flex-row px-6 mt-6 gap-3">
          <View className="bg-white/20 rounded-2xl p-4 flex-1 flex-row items-center">
            <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Ionicons name="receipt-outline" size={20} color="#fff" />
            </View>
            <View className="ml-3">
              <Text className="text-white text-xl font-bold">{transactions.length}</Text>
              <Text className="text-blue-100 text-xs font-medium mt-0.5">Total Records</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <TransactionList />
    </View>
  );
}