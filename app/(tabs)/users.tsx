import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Layout,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserForm from "../../components/UserForm";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../utils/helpers";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// ─── Responsive Helpers ───
const scale = (size) => (SCREEN_WIDTH / 390) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / 844) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// ─── Color Palette ───
const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  primaryDark: "#3730A3",
  accent: "#06B6D4",
  accentLight: "#22D3EE",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  background: "#F1F5F9",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textLight: "#CBD5E1",
  overlay: "rgba(15, 23, 42, 0.04)",
};

// ─── Animated Avatar ───
function UserAvatar({ name, size = "md", isActive = false, index = 0 }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const dimensions = {
    sm: scale(40),
    md: scale(48),
    lg: scale(64),
    xl: scale(80),
  };

  const fontSizes = {
    sm: moderateScale(14),
    md: moderateScale(17),
    lg: moderateScale(24),
    xl: moderateScale(30),
  };

  const avatarColors = [
    ["#6366F1", "#8B5CF6"],
    ["#06B6D4", "#0EA5E9"],
    ["#10B981", "#34D399"],
    ["#F59E0B", "#FBBF24"],
    ["#EF4444", "#F87171"],
    ["#EC4899", "#F472B6"],
    ["#8B5CF6", "#A78BFA"],
    ["#14B8A6", "#2DD4BF"],
  ];

  const colorIndex = (name?.charCodeAt(0) || 0) % avatarColors.length;
  const gradientColors = isActive
    ? ["#4F46E5", "#7C3AED"]
    : avatarColors[colorIndex];

  const dim = dimensions[size];

  return (
    <View style={{ position: "relative" }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          alignItems: "center",
          justifyContent: "center",
          ...(isActive && {
            shadowColor: "#4F46E5",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }),
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "800",
            fontSize: fontSizes[size],
            letterSpacing: 0.5,
          }}
        >
          {initial}
        </Text>
      </LinearGradient>

      {isActive && (
        <Animated.View
          entering={FadeIn.delay(300).springify()}
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: scale(16),
            height: scale(16),
            borderRadius: scale(8),
            backgroundColor: COLORS.success,
            borderWidth: 2.5,
            borderColor: COLORS.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={8} color="#fff" />
        </Animated.View>
      )}
    </View>
  );
}

// ─── Glassmorphic Stat Pill ───
function StatPill({ icon, label, value, gradient, delay = 0 }) {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify().damping(15)}
      style={{ flex: 1 }}
    >
      <AnimatedPressable
        onPressIn={() => {
          pressScale.value = withSpring(0.95, { damping: 15 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 15 });
        }}
        style={animatedStyle}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: scale(20),
            padding: scale(14),
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
            minHeight: verticalScale(100),
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: scale(36),
              height: scale(36),
              borderRadius: scale(12),
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={icon} size={moderateScale(18)} color="#fff" />
          </View>

          <View style={{ marginTop: verticalScale(12) }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: moderateScale(24),
                fontWeight: "900",
                letterSpacing: -0.5,
              }}
            >
              {value}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: moderateScale(11),
                fontWeight: "600",
                marginTop: 2,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              {label}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ─── Interactive User Card ───
function UserCard({ user, isCurrentUser, index }) {
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(18)
        .stiffness(120)}
      layout={Layout.springify()}
    >
      <AnimatedPressable
        onPressIn={() => {
          pressScale.value = withSpring(0.97, { damping: 15 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 15 });
        }}
        style={animatedStyle}
      >
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: scale(20),
            padding: scale(16),
            marginBottom: scale(12),
            borderWidth: isCurrentUser ? 1.5 : 1,
            borderColor: isCurrentUser
              ? "rgba(79,70,229,0.2)"
              : COLORS.borderLight,
            shadowColor: isCurrentUser ? "#4F46E5" : "#0F172A",
            shadowOffset: { width: 0, height: isCurrentUser ? 4 : 2 },
            shadowOpacity: isCurrentUser ? 0.08 : 0.03,
            shadowRadius: isCurrentUser ? 16 : 8,
            elevation: isCurrentUser ? 5 : 2,
            ...(isCurrentUser && {
              backgroundColor: "#FEFEFF",
            }),
          }}
        >
          {/* Active indicator strip */}
          {isCurrentUser && (
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                left: 0,
                top: scale(12),
                bottom: scale(12),
                width: scale(3.5),
                borderRadius: scale(2),
              }}
            />
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: isCurrentUser ? scale(4) : 0,
            }}
          >
            <UserAvatar
              name={user.fullName}
              size="md"
              isActive={isCurrentUser}
              index={index}
            />

            <View style={{ flex: 1, marginLeft: scale(14) }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.textPrimary,
                    fontWeight: "700",
                    fontSize: moderateScale(15),
                    letterSpacing: -0.2,
                    flexShrink: 1,
                  }}
                >
                  {user.fullName}
                </Text>
                {isCurrentUser && (
                  <LinearGradient
                    colors={["#EEF2FF", "#E0E7FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      marginLeft: scale(8),
                      paddingHorizontal: scale(8),
                      paddingVertical: scale(3),
                      borderRadius: scale(6),
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: moderateScale(10),
                        fontWeight: "800",
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      You
                    </Text>
                  </LinearGradient>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: scale(5),
                }}
              >
                <View
                  style={{
                    width: scale(20),
                    height: scale(20),
                    borderRadius: scale(6),
                    backgroundColor: COLORS.borderLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: scale(6),
                  }}
                >
                  <Ionicons
                    name="mail"
                    size={moderateScale(10)}
                    color={COLORS.textMuted}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: moderateScale(12),
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {user.email}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: scale(4),
                }}
              >
                <View
                  style={{
                    width: scale(20),
                    height: scale(20),
                    borderRadius: scale(6),
                    backgroundColor: COLORS.borderLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: scale(6),
                  }}
                >
                  <Ionicons
                    name="time"
                    size={moderateScale(10)}
                    color={COLORS.textMuted}
                  />
                </View>
                <Text
                  style={{
                    color: COLORS.textLight,
                    fontSize: moderateScale(11),
                    fontWeight: "500",
                  }}
                >
                  Joined {formatDate(user.createdAt)}
                </Text>
              </View>
            </View>

            <View
              style={{
                width: scale(32),
                height: scale(32),
                borderRadius: scale(10),
                backgroundColor: COLORS.borderLight,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: scale(8),
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={moderateScale(14)}
                color={COLORS.textMuted}
              />
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ─── Floating Action Button ───
function FloatingAddButton({ onPress, isOpen }) {
  const rotation = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withSpring(isOpen ? 45 : 0, { damping: 15 });
  }, [isOpen]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        buttonScale.value = withSpring(0.92, { damping: 15 });
      }}
      onPressOut={() => {
        buttonScale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        containerStyle,
        {
          position: "absolute",
          bottom: verticalScale(30),
          right: scale(20),
          zIndex: 50,
        },
      ]}
    >
      <LinearGradient
        colors={isOpen ? ["#EF4444", "#DC2626"] : ["#4F46E5", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: scale(56),
          height: scale(56),
          borderRadius: scale(18),
          alignItems: "center",
          justifyContent: "center",
          shadowColor: isOpen ? "#EF4444" : "#4F46E5",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        <Animated.View style={iconStyle}>
          <Ionicons name="add" size={moderateScale(28)} color="#fff" />
        </Animated.View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

// ─── Section Header ───
function SectionHeader({ title, count, onFilter }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: scale(16),
        paddingHorizontal: scale(4),
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            color: COLORS.textPrimary,
            fontWeight: "800",
            fontSize: moderateScale(20),
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Text>
        {count !== undefined && (
          <View
            style={{
              marginLeft: scale(10),
              backgroundColor: COLORS.primary,
              paddingHorizontal: scale(10),
              paddingVertical: scale(3),
              borderRadius: scale(8),
              minWidth: scale(28),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: moderateScale(11),
                fontWeight: "800",
              }}
            >
              {count}
            </Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={onFilter}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.surfaceAlt,
          paddingHorizontal: scale(12),
          paddingVertical: scale(8),
          borderRadius: scale(10),
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Ionicons
          name="options-outline"
          size={moderateScale(14)}
          color={COLORS.textSecondary}
        />
        <Text
          style={{
            color: COLORS.textSecondary,
            fontSize: moderateScale(12),
            fontWeight: "600",
            marginLeft: scale(5),
          }}
        >
          Filter
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Empty State ───
function EmptyState() {
  return (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: scale(24),
        padding: scale(32),
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        borderStyle: "dashed",
      }}
    >
      <LinearGradient
        colors={["#EEF2FF", "#E0E7FF"]}
        style={{
          width: scale(80),
          height: scale(80),
          borderRadius: scale(24),
          alignItems: "center",
          justifyContent: "center",
          marginBottom: scale(20),
        }}
      >
        <Ionicons
          name="people-outline"
          size={moderateScale(36)}
          color={COLORS.primaryLight}
        />
      </LinearGradient>

      <Text
        style={{
          color: COLORS.textPrimary,
          fontWeight: "800",
          fontSize: moderateScale(18),
          letterSpacing: -0.3,
        }}
      >
        No Users Yet
      </Text>
      <Text
        style={{
          color: COLORS.textMuted,
          fontSize: moderateScale(13),
          fontWeight: "500",
          textAlign: "center",
          marginTop: scale(8),
          lineHeight: moderateScale(20),
          paddingHorizontal: scale(16),
        }}
      >
        Tap the + button to create your first user and get started
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: scale(20),
          backgroundColor: COLORS.surfaceAlt,
          paddingHorizontal: scale(16),
          paddingVertical: scale(10),
          borderRadius: scale(12),
        }}
      >
        <Ionicons
          name="arrow-down"
          size={moderateScale(14)}
          color={COLORS.primary}
        />
        <Text
          style={{
            color: COLORS.primary,
            fontSize: moderateScale(12),
            fontWeight: "700",
            marginLeft: scale(6),
          }}
        >
          Tap + to add
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ───
export default function UsersScreen() {
  const { users, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const insets = useSafeAreaInsets();

  const todayUsers = users.filter((u) => {
    const today = new Date().toDateString();
    return new Date(u.createdAt).toDateString() === today;
  });

  const handleToggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: verticalScale(120),
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Hero Header ── */}
        <LinearGradient
          colors={["#312E81", "#4338CA", "#4F46E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            paddingTop: insets.top + verticalScale(16),
            paddingBottom: verticalScale(32),
            borderBottomLeftRadius: scale(32),
            borderBottomRightRadius: scale(32),
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <View
            style={{
              position: "absolute",
              top: -scale(40),
              right: -scale(40),
              width: scale(200),
              height: scale(200),
              borderRadius: scale(100),
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -scale(20),
              left: -scale(30),
              width: scale(120),
              height: scale(120),
              borderRadius: scale(60),
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          />

          {/* Top bar */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: scale(24),
              marginBottom: verticalScale(24),
            }}
          >
            <View>
              <Text
                style={{
                  color: "rgba(199,210,254,0.8)",
                  fontSize: moderateScale(13),
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                Welcome back 👋
              </Text>
              {currentUser ? (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: moderateScale(26),
                    fontWeight: "900",
                    letterSpacing: -0.8,
                    marginTop: scale(4),
                  }}
                >
                  {currentUser.fullName}
                </Text>
              ) : (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: moderateScale(26),
                    fontWeight: "900",
                    letterSpacing: -0.8,
                    marginTop: scale(4),
                  }}
                >
                  EllaTech
                </Text>
              )}
            </View>

            {currentUser ? (
              <UserAvatar
                name={currentUser.fullName}
                size="lg"
                isActive={true}
              />
            ) : (
              <View
                style={{
                  width: scale(48),
                  height: scale(48),
                  borderRadius: scale(16),
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={moderateScale(22)}
                  color="rgba(255,255,255,0.7)"
                />
              </View>
            )}
          </Animated.View>

          {/* Email info */}
          {currentUser && (
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: scale(24),
                marginBottom: verticalScale(20),
              }}
            >
              <View
                style={{
                  width: scale(6),
                  height: scale(6),
                  borderRadius: scale(3),
                  backgroundColor: "#34D399",
                  marginRight: scale(8),
                }}
              />
              <Text
                style={{
                  color: "rgba(199,210,254,0.8)",
                  fontSize: moderateScale(13),
                  fontWeight: "500",
                }}
              >
                {currentUser.email}
              </Text>
            </Animated.View>
          )}

          {/* Stats Row */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: scale(20),
              gap: scale(10),
            }}
          >
            <StatPill
              icon="people"
              label="Total"
              value={users.length}
              delay={100}
            />
            <StatPill
              icon="flash"
              label="Today"
              value={todayUsers.length}
              delay={200}
            />
            <StatPill
              icon="pulse"
              label="Active"
              value={currentUser ? 1 : 0}
              delay={300}
            />
          </View>
        </LinearGradient>

        {/* ── Form Section ── */}
        {showForm && (
          <Animated.View
            entering={SlideInDown.springify().damping(18)}
            exiting={SlideOutUp.springify().damping(18)}
            style={{
              paddingHorizontal: scale(20),
              marginTop: verticalScale(20),
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: scale(24),
                padding: scale(20),
                borderWidth: 1,
                borderColor: COLORS.border,
                shadowColor: "#4F46E5",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 24,
                elevation: 6,
              }}
            >
              {/* Form Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: scale(20),
                  paddingBottom: scale(16),
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.borderLight,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <LinearGradient
                    colors={["#EEF2FF", "#E0E7FF"]}
                    style={{
                      width: scale(40),
                      height: scale(40),
                      borderRadius: scale(12),
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: scale(12),
                    }}
                  >
                    <Ionicons
                      name="person-add"
                      size={moderateScale(18)}
                      color={COLORS.primary}
                    />
                  </LinearGradient>
                  <View>
                    <Text
                      style={{
                        color: COLORS.textPrimary,
                        fontWeight: "800",
                        fontSize: moderateScale(16),
                        letterSpacing: -0.3,
                      }}
                    >
                      New User
                    </Text>
                    <Text
                      style={{
                        color: COLORS.textMuted,
                        fontSize: moderateScale(11),
                        fontWeight: "500",
                        marginTop: 2,
                      }}
                    >
                      Fill in the details below
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setShowForm(false)}
                  style={{
                    width: scale(32),
                    height: scale(32),
                    borderRadius: scale(10),
                    backgroundColor: "#FEF2F2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="close"
                    size={moderateScale(16)}
                    color={COLORS.error}
                  />
                </Pressable>
              </View>

              <UserForm onSuccess={handleFormSuccess} />
            </View>
          </Animated.View>
        )}

        {/* ── Users List ── */}
        <View
          style={{
            paddingHorizontal: scale(20),
            marginTop: verticalScale(24),
          }}
        >
          <SectionHeader
            title="Members"
            count={users.length}
            onFilter={() => {}}
          />

          {users.length === 0 ? (
            <EmptyState />
          ) : (
            users.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                isCurrentUser={currentUser?.id === user.id}
                index={index}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* ── Floating Button ── */}
      <FloatingAddButton onPress={handleToggleForm} isOpen={showForm} />
    </View>
  );
}