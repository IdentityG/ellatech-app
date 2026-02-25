// components/TransactionList.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";
import { Transaction } from "../types";
import EmptyState from "./EmptyState";

const PAGE_SIZE = 8;

const TransactionItem = ({ item }: { item: Transaction }) => {
  const isAdd = item.type === "ADD";
  return (
    <View className="bg-white rounded-3xl p-4 mx-4 mb-3 border border-gray-100 shadow-sm flex-row items-center">
      <View
        className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${isAdd ? "bg-emerald-50" : "bg-red-50"
          }`}
      >
        <Ionicons
          name={isAdd ? "arrow-down" : "arrow-up"}
          size={24}
          color={isAdd ? "#10b981" : "#ef4444"}
        />
      </View>

      <View className="flex-1">
        <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>
          {item.productName}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">
          By: {item.performedBy}
        </Text>
        <Text className="text-gray-400 text-xs mt-0.5">
          {formatDate(item.timestamp)}
        </Text>
      </View>

      <View className="items-end">
        <Text
          className={`text-lg font-bold ${isAdd ? "text-emerald-600" : "text-red-600"
            }`}
        >
          {isAdd ? `+${item.quantity}` : `-${item.quantity}`}
        </Text>
        <View className="bg-gray-100 px-2 py-1 rounded-lg mt-1">
          <Text className="text-gray-500 text-xs font-bold">
            {item.quantityBefore} → {item.quantityAfter}
          </Text>
        </View>
      </View>
    </View>
  );
};

const TransactionList = () => {
  const { paginatedTransactions, totalPages, transactions } = useApp();
  const [page, setPage] = useState(1);
  const pages = totalPages(PAGE_SIZE);
  const data = paginatedTransactions(page, PAGE_SIZE);

  if (transactions.length === 0) {
    return (
      <View className="flex-1 mt-6">
        <EmptyState
          icon="🧾"
          title="No transactions yet"
          subtitle="Stock adjustments and product registrations will appear here."
        />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-100 absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`w-12 h-12 rounded-full items-center justify-center ${page === 1 ? "bg-gray-100" : "bg-blue-100"
            }`}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={page === 1 ? "#9ca3af" : "#2563eb"}
          />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-gray-900 font-bold text-base">
            Page {page} of {pages}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {transactions.length} total records
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setPage((p) => Math.min(pages, p + 1))}
          disabled={page === pages}
          className={`w-12 h-12 rounded-full items-center justify-center ${page === pages ? "bg-gray-100" : "bg-blue-100"
            }`}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={page === pages ? "#9ca3af" : "#2563eb"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionList;