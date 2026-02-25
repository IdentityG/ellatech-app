import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import ProductStatusCard from "../../components/ProductStatusCard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

const scale = (size) => (SCREEN_WIDTH / 390) * size;
const vScale = (size) => (SCREEN_HEIGHT / 844) * size;
const mScale = (size, f = 0.5) => size + (scale(size) - size) * f;

const C = {
  primary: "#A21CAF",
  primaryLight: "#E879F9",
  primaryDark: "#86198F",
  primaryDeep: "#701A75",
  accent: "#F0ABFC",
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
  fuchsiaBg: "#FDF4FF",
  fuchsiaBorder: "#FAE8FF",
};

function FadeInView({ delay = 0, duration = 500, style, children }) {
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

function ScalePress({ onPress, style, children, scaleValue = 0.97 }) {
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

function StatPill({ icon, label, value, iconColor, delay = 0 }) {
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
            <Ionicons
              name={icon}
              size={mScale(18)}
              color={iconColor || "#fff"}
            />
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

function HealthBar({ total, lowStock, outOfStock }) {
  const healthy = total - lowStock - outOfStock;
  const healthyPct = total > 0 ? (healthy / total) * 100 : 0;
  const lowPct = total > 0 ? (lowStock / total) * 100 : 0;
  const outPct = total > 0 ? (outOfStock / total) * 100 : 0;

  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: 1,
      friction: 8,
      tension: 30,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <FadeInView delay={400}>
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: scale(16),
          padding: scale(14),
          marginHorizontal: scale(20),
          marginTop: vScale(16),
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: scale(10),
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: mScale(12),
              fontWeight: "700",
              letterSpacing: 0.3,
            }}
          >
            Inventory Health
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: mScale(11),
              fontWeight: "600",
            }}
          >
            {total > 0 ? Math.round(healthyPct) : 0}% healthy
          </Text>
        </View>

        <View
          style={{
            height: scale(8),
            borderRadius: scale(4),
            backgroundColor: "rgba(255,255,255,0.1)",
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          {healthyPct > 0 && (
            <Animated.View
              style={{
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", `${healthyPct}%`],
                }),
                backgroundColor: "#34D399",
                borderRadius: scale(4),
              }}
            />
          )}
          {lowPct > 0 && (
            <Animated.View
              style={{
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", `${lowPct}%`],
                }),
                backgroundColor: "#FBBF24",
                borderRadius: scale(4),
              }}
            />
          )}
          {outPct > 0 && (
            <Animated.View
              style={{
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", `${outPct}%`],
                }),
                backgroundColor: "#F87171",
                borderRadius: scale(4),
              }}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: scale(10),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: scale(8),
                height: scale(8),
                borderRadius: scale(4),
                backgroundColor: "#34D399",
                marginRight: scale(5),
              }}
            />
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: mScale(10),
                fontWeight: "600",
              }}
            >
              Good
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: scale(8),
                height: scale(8),
                borderRadius: scale(4),
                backgroundColor: "#FBBF24",
                marginRight: scale(5),
              }}
            />
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: mScale(10),
                fontWeight: "600",
              }}
            >
              Low
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: scale(8),
                height: scale(8),
                borderRadius: scale(4),
                backgroundColor: "#F87171",
                marginRight: scale(5),
              }}
            />
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: mScale(10),
                fontWeight: "600",
              }}
            >
              Empty
            </Text>
          </View>
        </View>
      </View>
    </FadeInView>
  );
}

function AlertBanner({ outOfStock, lowStock }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (outOfStock > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [outOfStock]);

  if (outOfStock === 0 && lowStock === 0) return null;

  const isUrgent = outOfStock > 0;
  const bg = isUrgent ? "#FEF2F2" : "#FFFBEB";
  const borderColor = isUrgent ? "#FECACA" : "#FDE68A";
  const iconBg = isUrgent ? "#FEE2E2" : "#FEF3C7";
  const iconColor = isUrgent ? C.error : C.warning;
  const titleColor = isUrgent ? "#991B1B" : "#92400E";
  const descColor = isUrgent ? "#DC2626" : "#D97706";

  return (
    <FadeInView delay={100}>
      <View
        style={{
          marginHorizontal: scale(20),
          marginTop: vScale(16),
          backgroundColor: bg,
          borderRadius: scale(16),
          padding: scale(14),
          borderWidth: 1,
          borderColor: borderColor,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ position: "relative", marginRight: scale(12) }}>
          {isUrgent && (
            <Animated.View
              style={{
                position: "absolute",
                width: scale(36),
                height: scale(36),
                borderRadius: scale(11),
                backgroundColor: iconBg,
                opacity: pulseAnim,
                transform: [{ scale: pulseAnim }],
              }}
            />
          )}
          <View
            style={{
              width: scale(36),
              height: scale(36),
              borderRadius: scale(11),
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={isUrgent ? "alert-circle" : "warning"}
              size={mScale(18)}
              color={iconColor}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: titleColor,
              fontSize: mScale(13),
              fontWeight: "700",
            }}
          >
            {isUrgent ? "Attention Required" : "Stock Running Low"}
          </Text>
          <Text
            style={{
              color: descColor,
              fontSize: mScale(11),
              fontWeight: "500",
              marginTop: 2,
              lineHeight: mScale(16),
            }}
          >
            {isUrgent
              ? `${outOfStock} product${outOfStock > 1 ? "s" : ""} out of stock`
              : `${lowStock} product${lowStock > 1 ? "s" : ""} running low`}
          </Text>
        </View>
        <View
          style={{
            width: scale(28),
            height: scale(28),
            borderRadius: scale(9),
            backgroundColor: isUrgent
              ? "rgba(239,68,68,0.1)"
              : "rgba(245,158,11,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={mScale(14)}
            color={iconColor}
          />
        </View>
      </View>
    </FadeInView>
  );
}

function EmptyProducts() {
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
          marginHorizontal: scale(4),
        }}
      >
        <LinearGradient
          colors={[C.fuchsiaBg, C.fuchsiaBorder]}
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
            name="analytics-outline"
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
          No Products to Display
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
          Register products in the Products tab to see their stock status here
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: scale(20),
            backgroundColor: C.fuchsiaBg,
            paddingHorizontal: scale(16),
            paddingVertical: scale(10),
            borderRadius: scale(12),
            borderWidth: 1,
            borderColor: C.fuchsiaBorder,
          }}
        >
          <Ionicons name="cube-outline" size={mScale(14)} color={C.primary} />
          <Text
            style={{
              color: C.primary,
              fontSize: mScale(12),
              fontWeight: "700",
              marginLeft: scale(6),
            }}
          >
            Go to Products
          </Text>
        </View>
      </View>
    </FadeInView>
  );
}

function AnimatedProductCard({ product, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(25)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = 200 + index * 70;
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
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
    <Pressable
      onPressIn={() =>
        Animated.spring(scaleAnim, {
          toValue: 0.97,
          friction: 8,
          useNativeDriver: true,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }).start()
      }
    >
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }, { scale: scaleAnim }],
          marginBottom: scale(12),
        }}
      >
        <ProductStatusCard product={product} />
      </Animated.View>
    </Pressable>
  );
}

export default function StatusScreen() {
  const { products } = useApp();
  const insets = useSafeAreaInsets();

  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const lowStock = products.filter(
    (p) => p.quantity > 0 && p.quantity <= 5
  ).length;
  const healthy = products.length - lowStock - outOfStock;

  const sortedProducts = [...products].sort((a, b) => a.quantity - b.quantity);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vScale(100) }}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#701A75", "#A21CAF", "#C026D3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                paddingTop: insets.top + vScale(16),
                paddingBottom: vScale(24),
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
                  right: scale(80),
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
                      color: "rgba(245,208,254,0.8)",
                      fontSize: mScale(13),
                      fontWeight: "600",
                      letterSpacing: 0.5,
                    }}
                  >
                    Inventory Health 🏥
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
                    Stock Status
                  </Text>
                </View>

                <ScalePress scaleValue={0.9}>
                  <LinearGradient
                    colors={[
                      "rgba(255,255,255,0.2)",
                      "rgba(255,255,255,0.1)",
                    ]}
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
                      name="pulse"
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
                <StatPill
                  icon="layers"
                  label="Total"
                  value={products.length}
                  iconColor="#fff"
                  delay={100}
                />
                <StatPill
                  icon="warning"
                  label="Low"
                  value={lowStock}
                  iconColor="#FBBF24"
                  delay={200}
                />
                <StatPill
                  icon="alert-circle"
                  label="Empty"
                  value={outOfStock}
                  iconColor="#F87171"
                  delay={300}
                />
              </View>

              <HealthBar
                total={products.length}
                lowStock={lowStock}
                outOfStock={outOfStock}
              />
            </LinearGradient>

            <AlertBanner outOfStock={outOfStock} lowStock={lowStock} />

            <FadeInView
              delay={200}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: scale(24),
                paddingTop: vScale(20),
                paddingBottom: vScale(8),
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={{
                    color: C.text,
                    fontWeight: "800",
                    fontSize: mScale(20),
                    letterSpacing: -0.5,
                  }}
                >
                  Stock Levels
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
                    {products.length}
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
                    name="swap-vertical"
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
                    Sort
                  </Text>
                </View>
              </ScalePress>
            </FadeInView>
          </>
        }
        ListEmptyComponent={
          <View style={{ paddingHorizontal: scale(20) }}>
            <EmptyProducts />
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: scale(20) }}>
            <AnimatedProductCard product={item} index={index} />
          </View>
        )}
      />
    </View>
  );
}