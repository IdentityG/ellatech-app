import React, { useState, useRef, useEffect, ReactNode } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
  LayoutAnimation,
  UIManager,
  ViewStyle,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserForm from "../../components/UserForm";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../utils/helpers";
import { User } from "../../types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

const scale = (size: number) => (SCREEN_WIDTH / 390) * size;
const vScale = (size: number) => (SCREEN_HEIGHT / 844) * size;
const mScale = (size: number, f = 0.5) => size + (scale(size) - size) * f;

const C = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  primaryDark: "#3730A3",
  accent: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  bg: "#F1F5F9",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  text: "#0F172A",
  textSec: "#475569",
  textMuted: "#94A3B8",
  textLight: "#CBD5E1",
};

function FadeInView({ delay = 0, duration = 500, style, children }: { delay?: number; duration?: number; style?: ViewStyle | ViewStyle[]; children: ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[style, { opacity, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  );
}

function ScalePress({ onPress, style, children, scaleValue = 0.97 }: { onPress?: () => void; style?: ViewStyle | ViewStyle[]; children: ReactNode; scaleValue?: number }) {
  const anim = useRef(new Animated.Value(1)).current;

  const onIn = () =>
    Animated.spring(anim, {
      toValue: scaleValue,
      friction: 8,
      useNativeDriver: true,
    }).start();

  const onOut = () =>
    Animated.spring(anim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut}>
      <Animated.View style={[style, { transform: [{ scale: anim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function UserAvatar({ name, size = "md", isActive = false }: { name: string; size?: "sm" | "md" | "lg"; isActive?: boolean }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  const dims: Record<string, number> = { sm: scale(40), md: scale(48), lg: scale(56) };
  const fonts: Record<string, number> = { sm: mScale(14), md: mScale(17), lg: mScale(22) };

  const palettes = [
    ["#6366F1", "#8B5CF6"],
    ["#06B6D4", "#0EA5E9"],
    ["#10B981", "#34D399"],
    ["#F59E0B", "#FBBF24"],
    ["#EF4444", "#F87171"],
    ["#EC4899", "#F472B6"],
    ["#8B5CF6", "#A78BFA"],
    ["#14B8A6", "#2DD4BF"],
  ];

  const idx = (name?.charCodeAt(0) || 0) % palettes.length;
  const colors = (isActive ? ["#4F46E5", "#7C3AED"] : palettes[idx]) as [string, string];
  const d = dims[size];

  return (
    <View>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
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
            color: "#fff",
            fontWeight: "800",
            fontSize: fonts[size],
          }}
        >
          {initial}
        </Text>
      </LinearGradient>

      {isActive && (
        <View
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: scale(16),
            height: scale(16),
            borderRadius: scale(8),
            backgroundColor: C.success,
            borderWidth: 2.5,
            borderColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={8} color="#fff" />
        </View>
      )}
    </View>
  );
}


type IconName = React.ComponentProps<typeof Ionicons>["name"];

function StatPill({ icon, label, value, delay = 0 }: { icon: IconName; label: string; value: string | number; delay?: number }) {
  return (
    <FadeInView delay={delay} style={{ flex: 1 }}>
      <ScalePress scaleValue={0.95}>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: scale(20),
            padding: scale(14),
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
            minHeight: vScale(100),
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
            <Ionicons name={icon} size={mScale(18)} color="#fff" />
          </View>

          <View style={{ marginTop: vScale(12) }}>
            <Text
              style={{
                color: "#fff",
                fontSize: mScale(24),
                fontWeight: "900",
                letterSpacing: -0.5,
              }}
            >
              {value}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: mScale(10),
                fontWeight: "700",
                marginTop: 2,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {label}
            </Text>
          </View>
        </View>
      </ScalePress>
    </FadeInView>
  );
}


function UserCard({ user, isCurrentUser, index }: { user: User; isCurrentUser: boolean; index: number }) {
  return (
    <FadeInView delay={150 + index * 80}>
      <ScalePress>
        <View
          style={{
            backgroundColor: C.surface,
            borderRadius: scale(20),
            padding: scale(16),
            marginBottom: scale(12),
            borderWidth: isCurrentUser ? 1.5 : 1,
            borderColor: isCurrentUser
              ? "rgba(79,70,229,0.2)"
              : C.borderLight,
            shadowColor: isCurrentUser ? "#4F46E5" : "#0F172A",
            shadowOffset: {
              width: 0,
              height: isCurrentUser ? 4 : 2,
            },
            shadowOpacity: isCurrentUser ? 0.08 : 0.03,
            shadowRadius: isCurrentUser ? 16 : 8,
            elevation: isCurrentUser ? 5 : 2,
          }}
        >
          {isCurrentUser && (
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                left: 0,
                top: scale(14),
                bottom: scale(14),
                width: scale(3.5),
                borderRadius: scale(2),
              }}
            />
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: isCurrentUser ? scale(6) : 0,
            }}
          >
            <UserAvatar
              name={user.fullName}
              size="md"
              isActive={isCurrentUser}
            />

            <View style={{ flex: 1, marginLeft: scale(14) }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: C.text,
                    fontWeight: "700",
                    fontSize: mScale(15),
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
                        color: C.primary,
                        fontSize: mScale(10),
                        fontWeight: "800",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
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
                  marginTop: scale(6),
                }}
              >
                <View
                  style={{
                    width: scale(22),
                    height: scale(22),
                    borderRadius: scale(7),
                    backgroundColor: C.borderLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: scale(6),
                  }}
                >
                  <Ionicons
                    name="mail"
                    size={mScale(10)}
                    color={C.textMuted}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    color: C.textSec,
                    fontSize: mScale(12),
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
                    width: scale(22),
                    height: scale(22),
                    borderRadius: scale(7),
                    backgroundColor: C.borderLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: scale(6),
                  }}
                >
                  <Ionicons
                    name="time"
                    size={mScale(10)}
                    color={C.textMuted}
                  />
                </View>
                <Text
                  style={{
                    color: C.textLight,
                    fontSize: mScale(11),
                    fontWeight: "500",
                  }}
                >
                  Joined {formatDate(user.createdAt)}
                </Text>
              </View>
            </View>


            <View
              style={{
                width: scale(34),
                height: scale(34),
                borderRadius: scale(11),
                backgroundColor: C.borderLight,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: scale(8),
              }}
            >
              <Ionicons
                name="chevron-forward"
                size={mScale(14)}
                color={C.textMuted}
              />
            </View>
          </View>
        </View>
      </ScalePress>
    </FadeInView>
  );
}

function FAB({ onPress, isOpen }: { onPress: () => void; isOpen: boolean }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: isOpen ? 1 : 0,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() =>
        Animated.spring(btnScale, {
          toValue: 0.88,
          friction: 8,
          useNativeDriver: true,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(btnScale, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }).start()
      }
      style={{
        position: "absolute",
        bottom: vScale(32),
        right: scale(20),
        zIndex: 50,
      }}
    >
      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <LinearGradient
          colors={
            isOpen
              ? ["#EF4444", "#DC2626"]
              : ["#4F46E5", "#7C3AED"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: scale(58),
            height: scale(58),
            borderRadius: scale(19),
            alignItems: "center",
            justifyContent: "center",
            shadowColor: isOpen ? "#EF4444" : "#4F46E5",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons
              name="add"
              size={mScale(28)}
              color="#fff"
            />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <FadeInView delay={300}>
      <View
        style={{
          backgroundColor: C.surface,
          borderRadius: scale(24),
          padding: scale(36),
          alignItems: "center",
          borderWidth: 1.5,
          borderColor: C.border,
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
            size={mScale(36)}
            color={C.primaryLight}
          />
        </LinearGradient>

        <Text
          style={{
            color: C.text,
            fontWeight: "800",
            fontSize: mScale(18),
          }}
        >
          No Users Yet
        </Text>
        <Text
          style={{
            color: C.textMuted,
            fontSize: mScale(13),
            fontWeight: "500",
            textAlign: "center",
            marginTop: scale(8),
            lineHeight: mScale(20),
            paddingHorizontal: scale(12),
          }}
        >
          Tap the{" "}
          <Text style={{ color: C.primary, fontWeight: "800" }}>
            +
          </Text>{" "}
          button to create your first user
        </Text>
      </View>
    </FadeInView>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <FadeInView delay={200}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: scale(16),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: C.text,
              fontWeight: "800",
              fontSize: mScale(20),
              letterSpacing: -0.5,
            }}
          >
            {title}
          </Text>
          {count !== undefined && (
            <View
              style={{
                marginLeft: scale(10),
                backgroundColor: C.primary,
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
                  fontSize: mScale(11),
                  fontWeight: "800",
                }}
              >
                {count}
              </Text>
            </View>
          )}
        </View>

        <ScalePress scaleValue={0.93}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: C.surfaceAlt,
              paddingHorizontal: scale(12),
              paddingVertical: scale(8),
              borderRadius: scale(10),
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Ionicons
              name="options-outline"
              size={mScale(14)}
              color={C.textSec}
            />
            <Text
              style={{
                color: C.textSec,
                fontSize: mScale(12),
                fontWeight: "600",
                marginLeft: scale(5),
              }}
            >
              Filter
            </Text>
          </View>
        </ScalePress>
      </View>
    </FadeInView>
  );
}

export default function UsersScreen() {
  const { users, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const insets = useSafeAreaInsets();

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(-30)).current;

  const todayUsers = users.filter((u) => {
    const today = new Date().toDateString();
    return new Date(u.createdAt).toDateString() === today;
  });

  const toggleForm = () => {
    if (showForm) {
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslate, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        LayoutAnimation.configureNext(
          LayoutAnimation.Presets.easeInEaseOut
        );
        setShowForm(false);
      });
    } else {
      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
      );
      setShowForm(true);
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(formTranslate, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: vScale(120) }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#312E81", "#4338CA", "#4F46E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            paddingTop: insets.top + vScale(16),
            paddingBottom: vScale(32),
            borderBottomLeftRadius: scale(32),
            borderBottomRightRadius: scale(32),
            overflow: "hidden",
          }}
        >
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
          <FadeInView
            delay={50}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: scale(24),
              marginBottom: vScale(20),
            }}
          >
            <View style={{ flex: 1, marginRight: scale(16) }}>
              <Text
                style={{
                  color: "rgba(199,210,254,0.8)",
                  fontSize: mScale(13),
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                Welcome back 👋
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: "#fff",
                  fontSize: mScale(26),
                  fontWeight: "900",
                  letterSpacing: -0.8,
                  marginTop: scale(4),
                }}
              >
                {currentUser
                  ? currentUser.fullName
                  : "EllaTech"}
              </Text>
            </View>

            {currentUser ? (
              <UserAvatar
                name={currentUser.fullName}
                size="lg"
                isActive
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
                  size={mScale(22)}
                  color="rgba(255,255,255,0.7)"
                />
              </View>
            )}
          </FadeInView>

          {currentUser && (
            <FadeInView
              delay={150}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: scale(24),
                marginBottom: vScale(20),
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
                  fontSize: mScale(13),
                  fontWeight: "500",
                }}
              >
                {currentUser.email}
              </Text>
            </FadeInView>
          )}

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

        {showForm && (
          <Animated.View
            style={{
              paddingHorizontal: scale(20),
              marginTop: vScale(20),
              opacity: formOpacity,
              transform: [{ translateY: formTranslate }],
            }}
          >
            <View
              style={{
                backgroundColor: C.surface,
                borderRadius: scale(24),
                padding: scale(20),
                borderWidth: 1,
                borderColor: C.border,
                shadowColor: "#4F46E5",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 24,
                elevation: 6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: scale(20),
                  paddingBottom: scale(16),
                  borderBottomWidth: 1,
                  borderBottomColor: C.borderLight,
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
                      size={mScale(18)}
                      color={C.primary}
                    />
                  </LinearGradient>
                  <View>
                    <Text
                      style={{
                        color: C.text,
                        fontWeight: "800",
                        fontSize: mScale(16),
                      }}
                    >
                      New User
                    </Text>
                    <Text
                      style={{
                        color: C.textMuted,
                        fontSize: mScale(11),
                        fontWeight: "500",
                        marginTop: 2,
                      }}
                    >
                      Fill in the details below
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => toggleForm()}
                  style={{
                    width: scale(34),
                    height: scale(34),
                    borderRadius: scale(11),
                    backgroundColor: "#FEF2F2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="close"
                    size={mScale(16)}
                    color={C.error}
                  />
                </Pressable>
              </View>

              <UserForm
                onSuccess={() => {
                  toggleForm();
                }}
              />
            </View>
          </Animated.View>
        )}

        <View
          style={{
            paddingHorizontal: scale(20),
            marginTop: vScale(24),
          }}
        >
          <SectionHeader title="Members" count={users.length} />

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
      <FAB onPress={toggleForm} isOpen={showForm} />
    </View>
  );
}