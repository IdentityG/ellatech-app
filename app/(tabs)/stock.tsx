import React from "react";
import { ScrollView, Text, View, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import StockAdjuster from "../../components/StockAdjuster";

export default function StockScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={["#ea580c", "#f97316", "#fb923c"]}
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
              <Text className="text-orange-100 text-sm font-medium">
                Inventory Check
              </Text>
              <Text className="text-white text-3xl font-bold mt-1">
                Adjust Stock
              </Text>
            </View>
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="swap-horizontal" size={24} color="#fff" />
            </View>
          </View>
        </LinearGradient>

        <View className="px-5 mt-6 mb-2">
          <Text className="text-gray-500 text-sm">
            Select a product and enter an amount to add or remove stock. Note that stock cannot go below zero.
          </Text>
        </View>

        <StockAdjuster />
      </ScrollView>
    </View>
  );
}