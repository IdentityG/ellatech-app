import React from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "../../context/AppContext";
import ProductStatusCard from "../../components/ProductStatusCard";
import EmptyState from "../../components/EmptyState";

export default function StatusScreen() {
  const { products } = useApp();

  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 5).length;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <LinearGradient
        colors={["#a21caf", "#c026d3", "#e879f9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 60,
          paddingBottom: 40,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View className="px-6">
          <Text className="text-fuchsia-100 text-sm font-medium">Inventory Health</Text>
          <Text className="text-white text-3xl font-bold mt-1">Status Overview</Text>
        </View>

        {/* ── Stats Row ── */}
        <View className="flex-row px-6 mt-6 gap-3">
          <View className="bg-white/20 rounded-2xl p-4 flex-1">
            <Ionicons name="layers-outline" size={20} color="#fff" />
            <Text className="text-white text-2xl font-bold mt-2">{products.length}</Text>
            <Text className="text-fuchsia-100 text-xs font-medium mt-0.5">Total</Text>
          </View>
          <View className="bg-white/20 rounded-2xl p-4 flex-1">
            <Ionicons name="warning-outline" size={20} color="#fde047" />
            <Text className="text-white text-2xl font-bold mt-2">{lowStock}</Text>
            <Text className="text-yellow-200 text-xs font-medium mt-0.5">Low Stock</Text>
          </View>
          <View className="bg-white/20 rounded-2xl p-4 flex-1">
            <Ionicons name="alert-circle-outline" size={20} color="#fca5a5" />
            <Text className="text-white text-2xl font-bold mt-2">{outOfStock}</Text>
            <Text className="text-red-200 text-xs font-medium mt-0.5">Empty</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Products List ── */}
      <View className="flex-1 px-5 mt-6">
        <Text className="text-gray-900 font-bold text-lg mb-4">Stock Levels</Text>

        {products.length === 0 ? (
          <EmptyState
            icon="📊"
            title="No products to display"
            subtitle="Register products to see their stock status here."
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductStatusCard product={item} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}