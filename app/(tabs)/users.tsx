import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserForm from "../../components/UserForm";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../utils/helpers";
import { LinearGradient } from "expo-linear-gradient";

function UserAvatar({ name, size = "md", isActive = false }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <View className="relative">
      <LinearGradient
        colors={
          isActive
            ? ["#6366f1", "#8b5cf6", "#a78bfa"]
            : ["#e0e7ff", "#c7d2fe"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${sizeClasses[size]} rounded-full items-center justify-center`}
        style={{ borderRadius: 999 }}
      >
        <Text
          className={`${
            isActive ? "text-white" : "text-indigo-600"
          } font-bold ${textSizes[size]}`}
        >
          {initial}
        </Text>
      </LinearGradient>
      {isActive && (
        <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
      )}
    </View>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      icon: "#6366f1",
      text: "text-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "#10b981",
      text: "text-emerald-600",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "#f59e0b",
      text: "text-amber-600",
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <View className={`${c.bg} rounded-2xl p-4 flex-1`}>
      <Ionicons name={icon} size={20} color={c.icon} />
      <Text className={`${c.text} text-2xl font-bold mt-2`}>{value}</Text>
      <Text className="text-gray-400 text-xs font-medium mt-0.5">
        {label}
      </Text>
    </View>
  );
}

function UserCard({ user, isCurrentUser }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        transform: [{ scale: pressed ? 0.98 : 1 }],
      }}
    >
      <View
        className={`bg-white rounded-3xl p-4 mb-3 border ${
          isCurrentUser ? "border-indigo-200" : "border-gray-100"
        }`}
        style={{
          shadowColor: isCurrentUser ? "#6366f1" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isCurrentUser ? 0.1 : 0.04,
          shadowRadius: 12,
          elevation: isCurrentUser ? 4 : 2,
        }}
      >
        <View className="flex-row items-center">
          <UserAvatar
            name={user.fullName}
            size="md"
            isActive={isCurrentUser}
          />

          <View className="flex-1 ml-3">
            <View className="flex-row items-center">
              <Text
                className="text-gray-900 font-bold text-base"
                numberOfLines={1}
              >
                {user.fullName}
              </Text>
              {isCurrentUser && (
                <View className="bg-indigo-100 ml-2 px-2.5 py-0.5 rounded-full">
                  <Text className="text-indigo-600 text-xs font-bold">
                    You
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center mt-1">
              <Ionicons name="mail-outline" size={12} color="#9ca3af" />
              <Text
                className="text-gray-400 text-xs ml-1 flex-1"
                numberOfLines={1}
              >
                {user.email}
              </Text>
            </View>

            <View className="flex-row items-center mt-0.5">
              <Ionicons
                name="calendar-outline"
                size={12}
                color="#9ca3af"
              />
              <Text className="text-gray-300 text-xs ml-1">
                Joined {formatDate(user.createdAt)}
              </Text>
            </View>
          </View>

          <View className="ml-2">
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#d1d5db"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function UsersScreen() {
  const { users, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);

  const todayUsers = users.filter((u) => {
    const today = new Date().toDateString();
    return new Date(u.createdAt).toDateString() === today;
  });

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
          colors={["#4338ca", "#6366f1", "#818cf8"]}
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
            <Text className="text-indigo-200 text-sm font-medium">
              Welcome back
            </Text>
            {currentUser ? (
              <>
                <Text className="text-white text-3xl font-bold mt-1">
                  {currentUser.fullName}
                </Text>
                <View className="flex-row items-center mt-2">
                  <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                  <Text className="text-indigo-200 text-sm">
                    {currentUser.email}
                  </Text>
                </View>
              </>
            ) : (
              <Text className="text-white text-3xl font-bold mt-1">
                EllaTech
              </Text>
            )}
          </View>

          {/* ── Stats Row ── */}
          <View className="flex-row px-6 mt-6 gap-3">
            <StatCard
              icon="people"
              label="Total Users"
              value={users.length}
              color="indigo"
            />
            <StatCard
              icon="person-add"
              label="Today"
              value={todayUsers.length}
              color="emerald"
            />
            <StatCard
              icon="shield-checkmark"
              label="Active"
              value={currentUser ? 1 : 0}
              color="amber"
            />
          </View>
        </LinearGradient>

        {/* ── Add User Button / Form ── */}
        <View className="px-5 mt-6">
          <Pressable
            onPress={() => setShowForm(!showForm)}
            className="mb-4"
          >
            <LinearGradient
              colors={
                showForm
                  ? ["#f3f4f6", "#f3f4f6"]
                  : ["#6366f1", "#8b5cf6"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 16, padding: 16 }}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name={showForm ? "close-circle" : "person-add"}
                  size={20}
                  color={showForm ? "#6b7280" : "#fff"}
                />
                <Text
                  className={`${
                    showForm ? "text-gray-500" : "text-white"
                  } font-bold text-base ml-2`}
                >
                  {showForm ? "Cancel" : "Add New User"}
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
                <View className="w-8 h-8 bg-indigo-100 rounded-full items-center justify-center mr-3">
                  <Ionicons
                    name="person-add"
                    size={16}
                    color="#6366f1"
                  />
                </View>
                <Text className="text-gray-900 font-bold text-lg">
                  New User
                </Text>
              </View>
              <UserForm onSuccess={() => setShowForm(false)} />
            </View>
          )}
        </View>

        {/* ── Users List ── */}
        <View className="px-5 mt-2">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-bold text-lg">
                All Users
              </Text>
              <View className="bg-gray-200 ml-2 px-2.5 py-0.5 rounded-full">
                <Text className="text-gray-600 text-xs font-bold">
                  {users.length}
                </Text>
              </View>
            </View>

            <Pressable className="flex-row items-center">
              <Ionicons
                name="filter-outline"
                size={16}
                color="#9ca3af"
              />
              <Text className="text-gray-400 text-sm ml-1">Filter</Text>
            </Pressable>
          </View>

          {users.length === 0 ? (
            <View
              className="bg-white rounded-3xl p-8 items-center border border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons
                  name="people-outline"
                  size={36}
                  color="#d1d5db"
                />
              </View>
              <Text className="text-gray-900 font-bold text-lg">
                No Users Yet
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-1 px-4">
                Add your first user by tapping the button above
              </Text>
            </View>
          ) : (
            users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isCurrentUser={currentUser?.id === user.id}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}