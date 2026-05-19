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
  { label: "Preocupación menor", color: "#5D9E8A", bg: "#EDF4F1", icon: "checkmark-circle" as const },
  { label: "Casi amenazada", color: "#B8A85A", bg: "#F4F1ED", icon: "warning-outline" as const },
  { label: "Vulnerable", color: "#E8A598", bg: "#F7F0EE", icon: "alert-circle-outline" as const },
  { label: "En peligro", color: "#D97066", bg: "#F7EEEE", icon: "alert-circle" as const },
  { label: "En peligro crítico", color: "#B84040", bg: "#F7EEEE", icon: "close-circle" as const },
];

const TIPS = [
  {
    icon: "sunny-outline" as const,
    title: "Mejor momento para observar",
    text: "Temprano en la mañana (amanecer hasta 2 horas después) y al final de la tarde (2 horas antes del anochecer) son los momentos de mayor actividad.",
  },
  {
    icon: "eye-outline" as const,
    title: "Características clave de identificación",
    text: "Observa el tamaño, forma del pico, longitud de las patas, patrones de color y comportamiento. Las marcas en las alas suelen ser distintivas.",
  },
  {
    icon: "location-outline" as const,
    title: "Pistas del hábitat",
    text: "Las aves se adaptan a hábitats específicos. Un ave de pantano en un bosque es inusual — la ubicación ayuda a identificar la especie.",
  },
  {
    icon: "musical-notes-outline" as const,
    title: "Escucha los cantos",
    text: "Muchas aves se identifican por su canto antes que por la vista. Los cantos distintivos pueden confirmar la especie incluso cuando son visualmente similares.",
  },
  {
    icon: "calendar-outline" as const,
    title: "Variación estacional",
    text: "Los machos suelen tener plumaje nupcial (vivos) frente al plumaje invernal (más apagado). Los juveniles también tienen un aspecto diferente.",
  },
];

const FAMILIES = [
  { name: "Paseriformes", description: "Aves cantoras — el orden más grande, incluye gorriones, currucas y pinzones" },
  { name: "Rapaces", description: "Aves de presa: águilas, halcones, búhos — garras afiladas y picos ganchudos" },
  { name: "Aves acuáticas", description: "Patos, gansos, cisnes — patas palmeadas, picos planos y plumaje impermeable" },
  { name: "Zancudas", description: "Garzas, cigüeñas, flamencos — patas y cuellos largos para vadear aguas poco profundas" },
  { name: "Aves marinas", description: "Gaviotas, albatros, frailecillos — adaptadas para la vida en mar abierto" },
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
          <Text style={styles.title}>Guía de Campo</Text>
          <Text style={styles.subtitle}>Consejos para la observación e identificación de aves</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Consejos de observación</Text>
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
          <Text style={styles.sectionTitle}>Estado de conservación</Text>
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
          <Text style={styles.sectionTitle}>Principales familias de aves</Text>
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
