import React, { useRef, useEffect, ReactNode } from "react";
import {
  View,
  Text,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TransactionList from "../../components/TransactionList";
import { useApp } from "../../context/AppContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

const scale = (size: number) => (SCREEN_WIDTH / 390) * size;
const vScale = (size: number) => (SCREEN_HEIGHT / 844) * size;
const mScale = (size: number, f = 0.5) => size + (scale(size) - size) * f;

const C = {
  primary: "#2563EB",
  primaryLight: "#60A5FA",
  primaryDark: "#1D4ED8",
  primaryDeep: "#1E3A8A",
  accent: "#8B5CF6",
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
  blueBg: "#EFF6FF",
  blueBorder: "#DBEAFE",
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

function StatCard({ icon, label, value, sublabel, delay = 0 }: { icon: IconName; label: string; value: string | number; sublabel?: string; delay?: number }) {
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

function LiveDot() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
        paddingHorizontal: scale(10),
        paddingVertical: scale(5),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
      }}
    >
      <View style={{ position: "relative", marginRight: scale(6) }}>
        <Animated.View
          style={{
            position: "absolute",
            width: scale(8),
            height: scale(8),
            borderRadius: scale(4),
            backgroundColor: "#34D399",
            opacity: 0.4,
            transform: [{ scale: pulseAnim }],
          }}
        />
        <View
          style={{
            width: scale(8),
            height: scale(8),
            borderRadius: scale(4),
            backgroundColor: "#34D399",
          }}
        />
      </View>
      <Text
        style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: mScale(11),
          fontWeight: "700",
          letterSpacing: 0.3,
        }}
      >
        Live
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const { transactions } = useApp();
  const insets = useSafeAreaInsets();

  const todayTransactions = transactions.filter((t) => {
    const today = new Date().toDateString();
    return new Date(t.timestamp).toDateString() === today;
  });

  const totalVolume = transactions.reduce((acc, t) => {
    return acc + t.quantity * (t.unitPrice || 0);
  }, 0);

  const formatAmount = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val.toFixed(0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#1E3A8A", "#1D4ED8", "#2563EB"]}
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
            top: scale(60),
            left: scale(60),
            width: scale(80),
            height: scale(80),
            borderRadius: scale(40),
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(8),
              }}
            >
              <Text
                style={{
                  color: "rgba(191,219,254,0.8)",
                  fontSize: mScale(13),
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                Activity Log 📋
              </Text>
              <LiveDot />
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: mScale(28),
                fontWeight: "900",
                letterSpacing: -0.8,
                marginTop: scale(4),
              }}
            >
              History
            </Text>
          </View>

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
              <Ionicons
                name="time"
                size={mScale(22)}
                color="rgba(255,255,255,0.9)"
              />
            </LinearGradient>
          </ScalePress>
        </FadeInView>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: scale(20),
            gap: scale(10),
          }}
        >
          <StatCard
            icon="receipt"
            label="Records"
            value={transactions.length}
            delay={100}
          />
          <StatCard
            icon="today"
            label="Today"
            value={todayTransactions.length}
            delay={200}
          />
          <StatCard
            icon="trending-up"
            label="Volume"
            value={`ETB ${formatAmount(totalVolume)}`}
            delay={300}
          />
        </View>
      </LinearGradient>

      <View style={{ flex: 1, marginTop: vScale(8) }}>
        <FadeInView
          delay={200}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: scale(24),
            paddingTop: vScale(16),
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
              Transactions
            </Text>
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
                {transactions.length}
              </Text>
            </View>
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
        </FadeInView>

        <TransactionList />
      </View>
    </View>
  );
}