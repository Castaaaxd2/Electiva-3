import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const CONSERVATION_STATUSES = [
  { label: "Least Concern", color: "#5D9E8A", bg: "#EDF4F1", icon: "checkmark-circle" as const },
  { label: "Near Threatened", color: "#B8A85A", bg: "#F4F1ED", icon: "warning-outline" as const },
  { label: "Vulnerable", color: "#E8A598", bg: "#F7F0EE", icon: "alert-circle-outline" as const },
  { label: "Endangered", color: "#D97066", bg: "#F7EEEE", icon: "alert-circle" as const },
  { label: "Critically Endangered", color: "#B84040", bg: "#F7EEEE", icon: "close-circle" as const },
];

const TIPS = [
  {
    icon: "sunny-outline" as const,
    title: "Best time to observe",
    text: "Early morning (dawn to 2 hours after) and late afternoon (2 hours before dusk) are peak bird activity periods.",
  },
  {
    icon: "eye-outline" as const,
    title: "Key identification features",
    text: "Note size, beak shape, leg length, color patterns, and behavioral traits. Wing markings are often distinctive.",
  },
  {
    icon: "location-outline" as const,
    title: "Habitat clues",
    text: "Birds adapt to specific habitats. A marsh bird in a forest is unusual — location narrows your identification.",
  },
  {
    icon: "musical-notes-outline" as const,
    title: "Listen to calls",
    text: "Many birds are identified by song before sight. Distinctive calls can confirm species even when visually similar.",
  },
  {
    icon: "calendar-outline" as const,
    title: "Seasonal variation",
    text: "Male birds often have breeding plumage (vibrant) vs winter plumage (duller). Juveniles also look different.",
  },
];

const FAMILIES = [
  { name: "Passerines", description: "Perching birds — largest order, includes sparrows, warblers, finches", icon: "bird" },
  { name: "Raptors", description: "Birds of prey: eagles, hawks, falcons, owls — sharp talons and hooked beaks", icon: "owl" },
  { name: "Waterfowl", description: "Ducks, geese, swans — webbed feet, flat bills, waterproof plumage", icon: "duck" },
  { name: "Waders", description: "Herons, storks, flamingos — long legs and necks for shallow water foraging", icon: "bird" },
  { name: "Seabirds", description: "Gulls, albatrosses, puffins — adapted for open ocean life", icon: "bird" },
];

export default function GuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const styles = makeStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top }]}>
      <LinearGradient
        colors={["#F7F3EE", "#EDF4F1"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Field Guide</Text>
          <Text style={styles.subtitle}>Tips for birdwatching & identification</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Observation Tips</Text>
          {TIPS.map((tip, i) => (
            <Pressable
              key={i}
              style={styles.tipCard}
              onPress={() => setExpandedTip(expandedTip === i ? null : i)}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipIconWrap}>
                  <Ionicons name={tip.icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Ionicons
                  name={expandedTip === i ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.mutedForeground}
                />
              </View>
              {expandedTip === i && (
                <Text style={styles.tipBody}>{tip.text}</Text>
              )}
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Conservation Status</Text>
          <View style={styles.statusGrid}>
            {CONSERVATION_STATUSES.map((s, i) => (
              <View key={i} style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                <Ionicons name={s.icon} size={14} color={s.color} />
                <Text style={[styles.statusLabel, { color: s.color }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Major Bird Families</Text>
          {FAMILIES.map((f, i) => (
            <View key={i} style={styles.familyCard}>
              <View style={styles.familyIconWrap}>
                <MaterialCommunityIcons name="bird" size={20} color={colors.primary} />
              </View>
              <View style={styles.familyContent}>
                <Text style={styles.familyName}>{f.name}</Text>
                <Text style={styles.familyDesc}>{f.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 20,
      gap: 10,
    },
    lastSection: {
      paddingBottom: 120,
    },
    sectionTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
    },
    tipCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    tipIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.softGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    tipTitle: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    tipBody: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
      paddingLeft: 42,
    },
    statusGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
    },
    familyCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    familyIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.softGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    familyContent: {
      flex: 1,
      gap: 3,
    },
    familyName: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    familyDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
    },
  });
}
