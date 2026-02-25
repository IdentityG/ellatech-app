// components/ProductStatusCard.tsx

import React from "react";
import { View, Text } from "react-native";
import { Product } from "../types";
import { formatDate } from "../utils/helpers";

interface Props {
  product: Product;
}

const ProductStatusCard = ({ product }: Props) => {
  const isLow = product.quantity > 0 && product.quantity <= 5;
  const isOut = product.quantity === 0;

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-gray-900 font-bold text-base">
            {product.name}
          </Text>
          <Text className="text-gray-500 text-xs mt-0.5">
            SKU: {product.sku}
          </Text>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${
            isOut
              ? "bg-red-100"
              : isLow
              ? "bg-yellow-100"
              : "bg-emerald-100"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              isOut
                ? "text-red-600"
                : isLow
                ? "text-yellow-700"
                : "text-emerald-700"
            }`}
          >
            {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
          </Text>
        </View>
      </View>

      <View className="flex-row mt-2 gap-4">
        <View className="items-center bg-gray-50 rounded-xl px-4 py-2 flex-1">
          <Text className="text-2xl font-bold text-indigo-600">
            {product.quantity}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Units</Text>
        </View>
        <View className="items-center bg-gray-50 rounded-xl px-4 py-2 flex-1">
          <Text className="text-2xl font-bold text-gray-700">
            ETB {product.price.toFixed(2)}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Unit Price</Text>
        </View>
      </View>

      <Text className="text-gray-400 text-xs mt-3">
        Last updated: {formatDate(product.lastUpdated)}
      </Text>
    </View>
  );
};

export default ProductStatusCard;