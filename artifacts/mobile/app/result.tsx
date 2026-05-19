import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useBirdStore } from "@/context/BirdStore";
import { lookupSpecies } from "@/data/species";

function ConfidenceBar({ label, confidence, delay, colors }: {
  label: string;
  confidence: number;
  delay: number;
  colors: ReturnType<typeof useColors>;
}) {
  const width = useSharedValue(0);
  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  React.useEffect(() => {
    const timer = setTimeout(() => {
      width.value = withSpring(confidence, { damping: 20, stiffness: 80 });
    }, delay);
    return () => clearTimeout(timer);
  }, [confidence, delay]);

  const barColor = confidence >= 70 ? "#5D9E8A" : confidence >= 40 ? "#E8C598" : "#E8A598";

  return (
    <View style={{ gap: 5, marginBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground, flex: 1 }} numberOfLines={1}>
          {label}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: barColor, marginLeft: 8 }}>
          {confidence.toFixed(1)}%
        </Text>
      </View>
      <View style={{ height: 8, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
        <Animated.View style={[{ height: "100%", borderRadius: 4, backgroundColor: barColor }, barStyle]} />
      </View>
    </View>
  );
}

function InfoPill({ icon, label, value, colors }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={{ backgroundColor: colors.softGreen, borderRadius: 12, padding: 14, flex: 1, gap: 6, minWidth: "45%" }}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontFamily: "Inter_500Medium", color: colors.foreground, lineHeight: 18 }}>{value}</Text>
    </View>
  );
}

export default function ResultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { resultId } = useLocalSearchParams<{ resultId: string }>();
  const { history } = useBirdStore();

  const result = useMemo(
    () => history.find((r) => r.analyzedAt === resultId) ?? history[0],
    [history, resultId]
  );

  // Busca la especie en el dataset local de 32 especies
  const localSpeciesData = useMemo(() => {
    if (!result) return undefined;
    return lookupSpecies(result.topPrediction.commonName) ??
           lookupSpecies(result.topPrediction.species) ??
           lookupSpecies(result.topPrediction.scientificName);
  }, [result]);

  // Usa datos del dataset local si está disponible, si no usa los de la IA
  const speciesInfo = localSpeciesData ?? (result ? {
    description: result.description,
    habitat: result.habitat,
    diet: result.diet,
    conservationStatus: result.conservationStatus,
  } : null);

  const isFromDataset = !!localSpeciesData;

  const styles = makeStyles(colors);

  if (!result) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Resultado no encontrado</Text>
      </View>
    );
  }

  const top = result.topPrediction;
  const confidence = top.confidence;
  const confidenceColor = confidence >= 80 ? "#5D9E8A" : confidence >= 50 ? "#B8A85A" : "#E8A598";

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        {result.imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${result.imageBase64}` }}
            style={styles.heroImage}
          />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Ionicons name="camera-outline" size={48} color={colors.mutedForeground} />
          </View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(247,243,238,0.95)", "#F7F3EE"]}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      <Pressable
        style={[styles.backButton, { top: (Platform.OS === "web" ? insets.top + 67 : insets.top) + 12 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color={colors.foreground} />
      </Pressable>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === "web" ? insets.bottom + 34 + 80 : insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.commonName}>{top.commonName}</Text>
          <Text style={styles.scientificName}>{top.scientificName}</Text>

          <View style={styles.topBadgeRow}>
            <View style={[styles.confidenceBig, { backgroundColor: confidenceColor + "22" }]}>
              <Ionicons name="checkmark-circle" size={16} color={confidenceColor} />
              <Text style={[styles.confidenceBigText, { color: confidenceColor }]}>
                {confidence.toFixed(1)}% de confianza
              </Text>
            </View>
            <View style={[styles.statusBadge, isFromDataset && styles.datasetBadge]}>
              {isFromDataset && <Ionicons name="library-outline" size={12} color={colors.primary} />}
              <Text style={[styles.statusText, isFromDataset && styles.datasetBadgeText]}>
                {isFromDataset ? "En tu dataset" : speciesInfo?.conservationStatus ?? ""}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Sobre esta especie</Text>
            {isFromDataset && (
              <View style={styles.datasetTag}>
                <Text style={styles.datasetTagText}>Dataset propio</Text>
              </View>
            )}
          </View>
          <Text style={styles.descriptionText}>{speciesInfo?.description}</Text>
          {isFromDataset && (
            <View style={styles.conservationRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
              <Text style={styles.conservationText}>Estado: {speciesInfo?.conservationStatus}</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.pillGrid}>
          <InfoPill icon="leaf-outline" label="Hábitat" value={speciesInfo?.habitat ?? "—"} colors={colors} />
          <InfoPill icon="restaurant-outline" label="Alimentación" value={speciesInfo?.diet ?? "—"} colors={colors} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Precisión de predicción</Text>
          <Text style={styles.cardSubtitle}>Todas las posibles coincidencias de especie</Text>
          {result.allPredictions.map((pred, i) => (
            <ConfidenceBar
              key={i}
              label={pred.commonName || pred.species}
              confidence={pred.confidence}
              delay={300 + i * 100}
              colors={colors}
            />
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Text style={styles.timestampText}>
            Identificado el {new Date(result.analyzedAt).toLocaleString("es-ES")}
          </Text>
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
    heroImage: {
      width: "100%",
      height: 300,
    },
    heroPlaceholder: {
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    heroGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
    },
    backButton: {
      position: "absolute",
      left: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.9)",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    scrollView: {
      flex: 1,
      marginTop: -60,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 0,
      gap: 14,
    },
    commonName: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    scientificName: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      fontStyle: "italic",
      marginTop: 2,
    },
    topBadgeRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 10,
      flexWrap: "wrap",
    },
    confidenceBig: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    confidenceBigText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    statusBadge: {
      backgroundColor: colors.muted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    datasetBadge: {
      backgroundColor: colors.softGreen,
      borderWidth: 1,
      borderColor: colors.primary + "44",
    },
    statusText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    datasetBadgeText: {
      color: colors.primary,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    cardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cardTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    cardSubtitle: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: -4,
    },
    datasetTag: {
      backgroundColor: colors.primary + "18",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    datasetTagText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    descriptionText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 22,
    },
    conservationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 4,
    },
    conservationText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    pillGrid: {
      flexDirection: "row",
      gap: 10,
    },
    timestampText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingBottom: 8,
    },
  });
}
