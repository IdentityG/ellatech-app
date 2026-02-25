import React, { useState, useRef, useEffect, useCallback, ReactNode } from "react";
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
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProductForm from "../../components/ProductForm";
import { useApp } from "../../context/AppContext";
import { Product } from "../../types";

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
  primary: "#0D9488",
  primaryLight: "#5EEAD4",
  primaryDark: "#0F766E",
  primaryDeep: "#134E4A",
  accent: "#F59E0B",
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
  tealBg: "#F0FDFA",
  tealBorder: "#CCFBF1",
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

function ProductIcon({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dims: Record<string, number> = { sm: scale(36), md: scale(48), lg: scale(56) };
  const iconSizes: Record<string, number> = { sm: mScale(16), md: mScale(22), lg: mScale(26) };
  const d = dims[size];

  const palettes = [
    ["#0D9488", "#14B8A6"],
    ["#0891B2", "#06B6D4"],
    ["#059669", "#10B981"],
    ["#D97706", "#F59E0B"],
    ["#7C3AED", "#8B5CF6"],
    ["#DB2777", "#EC4899"],
    ["#2563EB", "#3B82F6"],
    ["#DC2626", "#EF4444"],
  ];

  const idx = (name?.charCodeAt(0) || 0) % palettes.length;
  const initial = name?.charAt(0)?.toUpperCase() || "P";

  return (
    <LinearGradient
      colors={palettes[idx] as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: d,
        height: d,
        borderRadius: scale(14),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "800",
          fontSize: iconSizes[size],
        }}
      >
        {initial}
      </Text>
    </LinearGradient>
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

function StockBadge({ quantity }: { quantity: number }) {
  let bg, textColor, label;

  if (quantity <= 0) {
    bg = "#FEF2F2";
    textColor = C.error;
    label = "Out";
  } else if (quantity <= 5) {
    bg = "#FFFBEB";
    textColor = C.warning;
    label = `${quantity} left`;
  } else {
    bg = C.tealBg;
    textColor = C.primary;
    label = `${quantity} in stock`;
  }

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        borderRadius: scale(8),
      }}
    >
      <Text
        style={{
          color: textColor,
          fontSize: mScale(10),
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <FadeInView delay={150 + index * 80}>
      <ScalePress>
        <View
          style={{
            backgroundColor: C.surface,
            borderRadius: scale(20),
            padding: scale(16),
            marginBottom: scale(12),
            borderWidth: 1,
            borderColor: C.borderLight,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ProductIcon name={product.name} size="md" />

            <View style={{ flex: 1, marginLeft: scale(14) }}>
              <Text
                numberOfLines={1}
                style={{
                  color: C.text,
                  fontWeight: "700",
                  fontSize: mScale(15),
                  letterSpacing: -0.2,
                }}
              >
                {product.name}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: scale(5),
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
                    name="barcode"
                    size={mScale(10)}
                    color={C.textMuted}
                  />
                </View>
                <Text
                  style={{
                    color: C.textMuted,
                    fontSize: mScale(11),
                    fontWeight: "500",
                  }}
                >
                  {product.sku}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: scale(8),
                  gap: scale(8),
                }}
              >
                <StockBadge quantity={product.quantity} />
                <View
                  style={{
                    backgroundColor: C.borderLight,
                    paddingHorizontal: scale(8),
                    paddingVertical: scale(4),
                    borderRadius: scale(8),
                  }}
                >
                  <Text
                    style={{
                      color: C.textSec,
                      fontSize: mScale(10),
                      fontWeight: "600",
                    }}
                  >
                    ETB {(product.price * product.quantity).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ alignItems: "flex-end", marginLeft: scale(8) }}>
              <Text
                style={{
                  color: C.primary,
                  fontWeight: "800",
                  fontSize: mScale(17),
                  letterSpacing: -0.3,
                }}
              >
                ETB {product.price.toFixed(2)}
              </Text>
              <Text
                style={{
                  color: C.textLight,
                  fontSize: mScale(10),
                  fontWeight: "500",
                  marginTop: scale(2),
                }}
              >
                per unit
              </Text>

              <View
                style={{
                  width: scale(30),
                  height: scale(30),
                  borderRadius: scale(10),
                  backgroundColor: C.borderLight,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: scale(8),
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
        </View>
      </ScalePress>
    </FadeInView>
  );
}

function EmptyProducts({ onAdd }: { onAdd: () => void }) {
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
          colors={[C.tealBg, C.tealBorder]}
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
            name="cube-outline"
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
          No Products Yet
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
          Start building your catalogue by adding your first product
        </Text>

        <ScalePress onPress={onAdd} scaleValue={0.95}>
          <LinearGradient
            colors={[C.primary, C.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: scale(24),
              paddingHorizontal: scale(24),
              paddingVertical: scale(12),
              borderRadius: scale(14),
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="add-circle" size={mScale(16)} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: mScale(14),
                fontWeight: "700",
                marginLeft: scale(8),
              }}
            >
              Add First Product
            </Text>
          </LinearGradient>
        </ScalePress>
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

function BottomSheetForm({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void }) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  const handleSuccess = () => {
    Keyboard.dismiss();
    onSuccess();
  };

  if (!showModal && !visible) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      statusBarTranslucent
      animationType="none"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(15,23,42,0.5)",
              opacity: backdropAnim,
            }}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View
            style={{
              backgroundColor: C.surface,
              borderTopLeftRadius: scale(28),
              borderTopRightRadius: scale(28),
              paddingBottom: insets.bottom + scale(20),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 20,
              maxHeight: SCREEN_HEIGHT * 0.88,
            }}
          >
            <View style={{ alignItems: "center", paddingTop: scale(12) }}>
              <View
                style={{
                  width: scale(40),
                  height: scale(4),
                  borderRadius: scale(2),
                  backgroundColor: C.border,
                }}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              contentContainerStyle={{ padding: scale(24) }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: scale(24),
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <LinearGradient
                    colors={[C.primary, C.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: scale(48),
                      height: scale(48),
                      borderRadius: scale(16),
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: scale(14),
                      shadowColor: C.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Ionicons
                      name="cube"
                      size={mScale(22)}
                      color="#fff"
                    />
                  </LinearGradient>
                  <View>
                    <Text
                      style={{
                        color: C.text,
                        fontWeight: "900",
                        fontSize: mScale(20),
                        letterSpacing: -0.5,
                      }}
                    >
                      New Product
                    </Text>
                    <Text
                      style={{
                        color: C.textMuted,
                        fontSize: mScale(12),
                        fontWeight: "500",
                        marginTop: scale(2),
                      }}
                    >
                      Fill in the product details
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={onClose}
                  style={{
                    width: scale(38),
                    height: scale(38),
                    borderRadius: scale(12),
                    backgroundColor: "#FEF2F2",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#FECACA",
                  }}
                >
                  <Ionicons
                    name="close"
                    size={mScale(18)}
                    color={C.error}
                  />
                </Pressable>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: C.borderLight,
                  marginBottom: scale(24),
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: C.tealBg,
                  padding: scale(14),
                  borderRadius: scale(14),
                  marginBottom: scale(24),
                  borderWidth: 1,
                  borderColor: C.tealBorder,
                }}
              >
                <View
                  style={{
                    width: scale(32),
                    height: scale(32),
                    borderRadius: scale(10),
                    backgroundColor: C.tealBorder,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: scale(12),
                  }}
                >
                  <Ionicons
                    name="information-circle"
                    size={mScale(16)}
                    color={C.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: C.primaryDeep,
                      fontSize: mScale(12),
                      fontWeight: "700",
                    }}
                  >
                    Product Info
                  </Text>
                  <Text
                    style={{
                      color: C.primaryDark,
                      fontSize: mScale(11),
                      fontWeight: "500",
                      marginTop: 2,
                      lineHeight: mScale(16),
                    }}
                  >
                    Name, SKU, price, and quantity are required fields.
                  </Text>
                </View>
              </View>

              <ProductForm onSuccess={handleSuccess} />

              <View style={{ height: scale(20) }} />
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FAB({ onPress, isOpen }: { onPress: () => void; isOpen: boolean }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isOpen) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isOpen]);

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
          toValue: 0.85,
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
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!isOpen && (
        <Animated.View
          style={{
            position: "absolute",
            width: scale(58),
            height: scale(58),
            borderRadius: scale(19),
            backgroundColor: "rgba(13,148,136,0.15)",
            transform: [{ scale: pulseAnim }],
          }}
        />
      )}

      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <LinearGradient
          colors={
            isOpen ? ["#EF4444", "#DC2626"] : [C.primary, C.primaryDark]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: scale(58),
            height: scale(58),
            borderRadius: scale(19),
            alignItems: "center",
            justifyContent: "center",
            shadowColor: isOpen ? "#EF4444" : C.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="add" size={mScale(28)} color="#fff" />
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {!isOpen && (
        <View
          style={{
            position: "absolute",
            right: scale(66),
            backgroundColor: C.text,
            paddingHorizontal: scale(12),
            paddingVertical: scale(6),
            borderRadius: scale(8),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: mScale(11),
              fontWeight: "700",
            }}
          >
            Add Product
          </Text>
          <View
            style={{
              position: "absolute",
              right: -scale(6),
              top: "50%",
              marginTop: -scale(6),
              width: 0,
              height: 0,
              borderTopWidth: scale(6),
              borderBottomWidth: scale(6),
              borderLeftWidth: scale(6),
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: C.text,
            }}
          />
        </View>
      )}
    </Pressable>
  );
}

function formatValue(val: number) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
  if (val >= 1000) return (val / 1000).toFixed(1) + "K";
  return val.toFixed(0);
}

export default function ProductsScreen() {
  const { products } = useApp();
  const [showForm, setShowForm] = useState(false);
  const insets = useSafeAreaInsets();

  const totalValue = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

  const lowStock = products.filter((p) => p.quantity <= 5).length;

  const openForm = useCallback(() => setShowForm(true), []);
  const closeForm = useCallback(() => setShowForm(false), []);
  const handleFormSuccess = useCallback(() => setShowForm(false), []);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: vScale(120) }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#134E4A", "#0F766E", "#0D9488"]}
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
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "rgba(153,246,228,0.8)",
                  fontSize: mScale(13),
                  fontWeight: "600",
                  letterSpacing: 0.5,
                }}
              >
                Inventory Management 📦
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
                Products
              </Text>
            </View>

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
                name="cube"
                size={mScale(22)}
                color="rgba(255,255,255,0.9)"
              />
            </View>
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
              label="Items"
              value={products.length}
              delay={100}
            />
            <StatPill
              icon="wallet"
              label="Value"
              value={`ETB ${formatValue(totalValue)}`}
              delay={200}
            />
            <StatPill
              icon="warning"
              label="Low Stock"
              value={lowStock}
              delay={300}
            />
          </View>
        </LinearGradient>

        <View
          style={{
            paddingHorizontal: scale(20),
            marginTop: vScale(24),
          }}
        >
          <SectionHeader title="Catalogue" count={products.length} />

          {products.length === 0 ? (
            <EmptyProducts onAdd={openForm} />
          ) : (
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))
          )}
        </View>
      </ScrollView>

      <FAB onPress={openForm} isOpen={showForm} />

      <BottomSheetForm
        visible={showForm}
        onClose={closeForm}
        onSuccess={handleFormSuccess}
      />
    </View>
  );
}