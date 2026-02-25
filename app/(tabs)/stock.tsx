import React, { useRef, useEffect, ReactNode } from "react";
import {
  ScrollView,
  Text,
  View,
  StatusBar,
  Animated,
  Dimensions,
  Pressable,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StockAdjuster from "../../components/StockAdjuster";
import { useApp } from "../../context/AppContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

const scale = (size: number) => (SCREEN_WIDTH / 390) * size;
const vScale = (size: number) => (SCREEN_HEIGHT / 844) * size;
const mScale = (size: number, f = 0.5) => size + (scale(size) - size) * f;

const C = {
  primary: "#EA580C",
  primaryLight: "#FB923C",
  primaryDark: "#C2410C",
  primaryDeep: "#9A3412",
  accent: "#FDBA74",
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
  orangeBg: "#FFF7ED",
  orangeBorder: "#FFEDD5",
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
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

function ScalePress({ onPress, style, children, scaleValue = 0.97 }: { onPress?: () => void; style?: ViewStyle | ViewStyle[]; children: ReactNode; scaleValue?: number }) {
  const anim = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() =>
        Animated.spring(anim, {
          toValue: scaleValue,
          friction: 8,
          useNativeDriver: true,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }).start()
      }
    >
      <Animated.View style={[style, { transform: [{ scale: anim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
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
                fontSize: mScale(22),
                fontWeight: "900",
                letterSpacing: -0.5,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
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

function SwapIcon() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <ScalePress scaleValue={0.9}>
      <LinearGradient
        colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
        style={{
          width: scale(48),
          height: scale(48),
          borderRadius: scale(16),
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name="swap-vertical"
            size={mScale(22)}
            color="rgba(255,255,255,0.9)"
          />
        </Animated.View>
      </LinearGradient>
    </ScalePress>
  );
}

function InstructionCard() {
  return (
    <FadeInView delay={300}>
      <View
        style={{
          marginHorizontal: scale(20),
          marginTop: vScale(20),
          marginBottom: vScale(8),
        }}
      >
        <View
          style={{
            backgroundColor: C.orangeBg,
            borderRadius: scale(16),
            padding: scale(16),
            borderWidth: 1,
            borderColor: C.orangeBorder,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              width: scale(36),
              height: scale(36),
              borderRadius: scale(11),
              backgroundColor: C.orangeBorder,
              alignItems: "center",
              justifyContent: "center",
              marginRight: scale(12),
              marginTop: scale(2),
            }}
          >
            <Ionicons
              name="information-circle"
              size={mScale(18)}
              color={C.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: C.primaryDeep,
                fontSize: mScale(13),
                fontWeight: "700",
                marginBottom: scale(4),
              }}
            >
              How it works
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: scale(6),
              }}
            >
              <View
                style={{
                  width: scale(20),
                  height: scale(20),
                  borderRadius: scale(10),
                  backgroundColor: C.orangeBorder,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: scale(8),
                }}
              >
                <Text
                  style={{
                    color: C.primary,
                    fontSize: mScale(10),
                    fontWeight: "800",
                  }}
                >
                  1
                </Text>
              </View>
              <Text
                style={{
                  color: C.primaryDark,
                  fontSize: mScale(12),
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: mScale(17),
                }}
              >
                Select a product from the dropdown
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: scale(6),
              }}
            >
              <View
                style={{
                  width: scale(20),
                  height: scale(20),
                  borderRadius: scale(10),
                  backgroundColor: C.orangeBorder,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: scale(8),
                }}
              >
                <Text
                  style={{
                    color: C.primary,
                    fontSize: mScale(10),
                    fontWeight: "800",
                  }}
                >
                  2
                </Text>
              </View>
              <Text
                style={{
                  color: C.primaryDark,
                  fontSize: mScale(12),
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: mScale(17),
                }}
              >
                Enter the quantity to adjust
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: scale(20),
                  height: scale(20),
                  borderRadius: scale(10),
                  backgroundColor: C.orangeBorder,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: scale(8),
                }}
              >
                <Text
                  style={{
                    color: C.primary,
                    fontSize: mScale(10),
                    fontWeight: "800",
                  }}
                >
                  3
                </Text>
              </View>
              <Text
                style={{
                  color: C.primaryDark,
                  fontSize: mScale(12),
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: mScale(17),
                }}
              >
                Tap add or remove (stock can't go below zero)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </FadeInView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <FadeInView delay={350}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: scale(24),
          paddingTop: vScale(12),
          paddingBottom: vScale(8),
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
        </View>

        <ScalePress scaleValue={0.93}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: C.orangeBg,
              paddingHorizontal: scale(12),
              paddingVertical: scale(8),
              borderRadius: scale(10),
              borderWidth: 1,
              borderColor: C.orangeBorder,
            }}
          >
            <Ionicons
              name="help-circle-outline"
              size={mScale(14)}
              color={C.primary}
            />
            <Text
              style={{
                color: C.primary,
                fontSize: mScale(12),
                fontWeight: "600",
                marginLeft: scale(5),
              }}
            >
              Help
            </Text>
          </View>
        </ScalePress>
      </View>
    </FadeInView>
  );
}

export default function StockScreen() {
  const { products } = useApp();
  const insets = useSafeAreaInsets();

  const totalStock = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStock = products.filter(
    (p) => p.quantity > 0 && p.quantity <= 5
  ).length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: vScale(120) }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#9A3412", "#C2410C", "#EA580C"]}
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
              top: -scale(50),
              right: -scale(30),
              width: scale(200),
              height: scale(200),
              borderRadius: scale(100),
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -scale(30),
              left: -scale(40),
              width: scale(140),
              height: scale(140),
              borderRadius: scale(70),
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: scale(80),
              left: scale(40),
              width: scale(60),
              height: scale(60),
              borderRadius: scale(30),
              backgroundColor: "rgba(255,255,255,0.02)",
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
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "rgba(254,215,170,0.8)",
                  fontSize: mScale(13),
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                Inventory Control 🔧
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: mScale(28),
                  fontWeight: "900",
                  letterSpacing: -0.8,
                  marginTop: scale(4),
                }}
              >
                Adjust Stock
              </Text>
            </View>

            <SwapIcon />
          </FadeInView>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: scale(20),
              gap: scale(10),
            }}
          >
            <StatPill
              icon="cube"
              label="Total Units"
              value={totalStock}
              delay={100}
            />
            <StatPill
              icon="warning"
              label="Low Stock"
              value={lowStock}
              delay={200}
            />
            <StatPill
              icon="close-circle"
              label="Out"
              value={outOfStock}
              delay={300}
            />
          </View>
        </LinearGradient>

        <InstructionCard />

        <SectionHeader title="Stock Adjuster" />

        <FadeInView
          delay={400}
          style={{
            paddingHorizontal: scale(20),
            marginTop: vScale(4),
          }}
        >
          <View
            style={{
              backgroundColor: C.surface,
              borderRadius: scale(24),
              padding: scale(20),
              borderWidth: 1,
              borderColor: C.border,
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 16,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: scale(20),
                paddingBottom: scale(16),
                borderBottomWidth: 1,
                borderBottomColor: C.borderLight,
              }}
            >
              <LinearGradient
                colors={[C.primary, C.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: scale(40),
                  height: scale(40),
                  borderRadius: scale(13),
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: scale(12),
                  shadowColor: C.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 3,
                }}
              >
                <Ionicons
                  name="build"
                  size={mScale(18)}
                  color="#fff"
                />
              </LinearGradient>
              <View>
                <Text
                  style={{
                    color: C.text,
                    fontWeight: "800",
                    fontSize: mScale(16),
                    letterSpacing: -0.3,
                  }}
                >
                  Manage Quantities
                </Text>
                <Text
                  style={{
                    color: C.textMuted,
                    fontSize: mScale(11),
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  Add or remove stock from products
                </Text>
              </View>
            </View>

            <StockAdjuster />
          </View>
        </FadeInView>

        <FadeInView
          delay={500}
          style={{
            paddingHorizontal: scale(20),
            marginTop: vScale(16),
          }}
        >
          <View
            style={{
              backgroundColor: C.surfaceAlt,
              borderRadius: scale(16),
              padding: scale(16),
              borderWidth: 1,
              borderColor: C.border,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: scale(40),
                height: scale(40),
                borderRadius: scale(12),
                backgroundColor: "#FEF3C7",
                alignItems: "center",
                justifyContent: "center",
                marginRight: scale(12),
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={mScale(18)}
                color="#D97706"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: C.text,
                  fontSize: mScale(13),
                  fontWeight: "700",
                }}
              >
                Safety Limit Active
              </Text>
              <Text
                style={{
                  color: C.textMuted,
                  fontSize: mScale(11),
                  fontWeight: "500",
                  marginTop: 2,
                  lineHeight: mScale(16),
                }}
              >
                Stock quantities are protected from going below zero
              </Text>
            </View>
            <View
              style={{
                width: scale(8),
                height: scale(8),
                borderRadius: scale(4),
                backgroundColor: C.success,
              }}
            />
          </View>
        </FadeInView>
      </ScrollView>
    </View>
  );
}