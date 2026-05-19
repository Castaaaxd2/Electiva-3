import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useBirdStore, type BirdResult } from "@/context/BirdStore";

function HistoryCard({ item, index, colors }: { item: BirdResult; index: number; colors: ReturnType<typeof useColors> }) {
  const styles = makeStyles(colors);

  const handlePress = () => {
    router.push({ pathname: "/result", params: { resultId: item.analyzedAt } });
  };

  const confidence = item.topPrediction.confidence;
  const confidenceColor = confidence >= 80 ? "#5D9E8A" : confidence >= 50 ? "#E8C598" : "#E8A598";

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
      <Pressable style={styles.card} onPress={handlePress}>
        {item.imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }}
            style={styles.cardImage}
          />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Ionicons name="image-outline" size={28} color={colors.mutedForeground} />
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardSpecies} numberOfLines={1}>{item.topPrediction.commonName}</Text>
          <Text style={styles.cardScientific} numberOfLines={1}>{item.topPrediction.scientificName}</Text>
          <View style={styles.cardMeta}>
            <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor + "22" }]}>
              <View style={[styles.confidenceDot, { backgroundColor: confidenceColor }]} />
              <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                {confidence.toFixed(1)}%
              </Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(item.analyzedAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
      </Pressable>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { history, clearHistory } = useBirdStore();
  const styles = makeStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top }]}>
      <LinearGradient
        colors={["#F7F3EE", "#EDF4F1"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Avistamientos</Text>
        {history.length > 0 && (
          <Pressable onPress={clearHistory} style={styles.clearBtn}>
            <Text style={styles.clearText}>Borrar todo</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.analyzedAt}
        renderItem={({ item, index }) => (
          <HistoryCard item={item} index={index} colors={colors} />
        )}
        contentContainerStyle={styles.list}
        scrollEnabled={!!history.length}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="binoculars-outline" size={52} color={colors.mutedForeground} />
            <Text style={styles.emptyTitle}>Sin avistamientos aún</Text>
            <Text style={styles.emptyText}>Las aves identificadas aparecerán aquí</Text>
          </View>
        }
      />
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 12,
    },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    clearBtn: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    clearText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.destructive,
    },
    list: {
      paddingHorizontal: 20,
      paddingBottom: 120,
      gap: 10,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardImage: {
      width: 68,
      height: 68,
      borderRadius: 12,
    },
    cardImagePlaceholder: {
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    cardContent: {
      flex: 1,
      gap: 3,
    },
    cardSpecies: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    cardScientific: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      fontStyle: "italic",
    },
    cardMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },
    confidenceBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
    },
    confidenceDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
    },
    confidenceText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    dateText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    empty: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
      gap: 12,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
  });
}
