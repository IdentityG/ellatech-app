import React, { useState } from "react";
import { ScrollView, View, Text, Pressable, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ProductForm from "../../components/ProductForm";
import { useApp } from "../../context/AppContext";
import EmptyState from "../../components/EmptyState";

export default function ProductsScreen() {
  const { products } = useApp();
  const [showForm, setShowForm] = useState(false);

  const totalValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#0f766e", "#14b8a6", "#5eead4"]}
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
            <Text className="text-teal-100 text-sm font-medium">
              Inventory Management
            </Text>
            <Text className="text-white text-3xl font-bold mt-1">
              Products
            </Text>
          </View>

          <View className="flex-row px-6 mt-6 gap-3">
            <View className="bg-white/20 rounded-2xl p-4 flex-1">
              <Ionicons name="cube-outline" size={20} color="#fff" />
              <Text className="text-white text-2xl font-bold mt-2">{products.length}</Text>
              <Text className="text-teal-100 text-xs font-medium mt-0.5">Total Items</Text>
            </View>
            <View className="bg-white/20 rounded-2xl p-4 flex-1">
              <Ionicons name="cash-outline" size={20} color="#fff" />
              <Text className="text-white text-xl font-bold mt-2">
                ETB {(totalValue > 1000 ? (totalValue / 1000).toFixed(1) + 'k' : totalValue.toFixed(0))}
              </Text>
              <Text className="text-teal-100 text-xs font-medium mt-0.5">Est. Value</Text>
            </View>
          </View>
        </LinearGradient>

        <View className="px-5 mt-6">
          <Pressable
            onPress={() => setShowForm(!showForm)}
            className="mb-4"
          >
            <LinearGradient
              colors={showForm ? ["#f3f4f6", "#f3f4f6"] : ["#0d9488", "#14b8a6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 16, padding: 16 }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name={showForm ? "close-circle" : "add-circle"}
                  size={20}
                  color={showForm ? "#6b7280" : "#fff"}
                />
                <Text
                  className={`${showForm ? "text-gray-500" : "text-white"
                    } font-bold text-base ml-2`}
                >
                  {showForm ? "Cancel" : "Add New Product"}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {showForm && (
            <View
              className="bg-white rounded-3xl p-5 mb-4 border border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-teal-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="pricetag" size={16} color="#0d9488" />
                </View>
                <Text className="text-gray-900 font-bold text-lg">
                  New Product
                </Text>
              </View>
              <ProductForm onSuccess={() => setShowForm(false)} />
            </View>
          )}
        </View>

        {/* ── Product List ── */}
        <View className="px-5 mt-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-bold text-lg">
              Product Catalogue
            </Text>
          </View>

          {products.length === 0 ? (
            <EmptyState
              icon="🛍️"
              title="No Products Yet"
              subtitle="Register your first product above."
            />
          ) : (
            products.map((p) => (
              <View
                key={p.id}
                className="bg-white rounded-3xl p-4 mb-3 border border-gray-100 flex-row items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 12,
                  elevation: 2,
                }}
              >
                <View className="w-12 h-12 bg-teal-50 rounded-2xl items-center justify-center mr-3">
                  <Ionicons name="cube" size={24} color="#0d9488" />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    SKU: {p.sku}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-teal-600 font-bold text-base">
                    ETB {p.price.toFixed(2)}
                  </Text>
                  <View className="bg-gray-100 px-2 py-1 rounded-lg mt-1">
                    <Text className="text-gray-600 text-xs font-bold">
                      Qty: {p.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}