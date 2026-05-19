import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "camera", selected: "camera.fill" }} />
        <Label>Identificar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <Icon sf={{ default: "clock", selected: "clock.fill" }} />
        <Label>Historial</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="guide">
        <Icon sf={{ default: "book", selected: "book.fill" }} />
        <Label>Guía</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  // On iOS, the tab bar height accounts for the home indicator (safe area bottom)
  const tabBarHeight = isWeb ? 84 : isIOS ? 50 + insets.bottom : 60;
  const tabBarPaddingBottom = isWeb ? 34 : isIOS ? insets.bottom : 8;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: 0,
          elevation: 0,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={95}
              tint={isDark ? "systemChromeMaterialDark" : "systemChromeMaterial"}
              style={[
                StyleSheet.absoluteFill,
                { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
              ]}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: colors.card,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Identificar",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="camera" tintColor={color} size={size} />
            ) : (
              <Ionicons name="camera-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="clock" tintColor={color} size={size} />
            ) : (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: "Guía",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="book" tintColor={color} size={size} />
            ) : (
              <MaterialCommunityIcons name="bird" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
