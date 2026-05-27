import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useBirdStore } from "@/context/BirdStore";
import SightingsMap from "@/components/SightingsMap";

const TOLIMA_REGION = {
  latitude: 4.4389,
  longitude: -75.2322,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
};

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { history } = useBirdStore();
  const styles = makeStyles(colors);

  const sightings = useMemo(() => history.filter((r) => r.location), [history]);

  const initialRegion = useMemo(() => {
    if (sightings.length === 0) return TOLIMA_REGION;
    const last = sightings[0];
    return {
      latitude: last.location!.latitude,
      longitude: last.location!.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };
  }, [sightings]);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top }]}>
      <View style={styles.header}>
        <LinearGradient
          colors={["#F4F7F0", "#EBF3D9"]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.title}>Mapa de Avistamientos</Text>
        <Text style={styles.subtitle}>
          {sightings.length > 0
            ? `${sightings.length} avistamiento${sightings.length !== 1 ? "s" : ""} registrado${sightings.length !== 1 ? "s" : ""}`
            : "Aún no hay avistamientos con ubicación GPS"}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <SightingsMap sightings={sightings} initialRegion={initialRegion} />

        {sightings.length === 0 && Platform.OS !== "web" && (
          <View style={styles.emptyOverlay}>
            <View style={styles.emptyCard}>
              <Ionicons name="location-outline" size={44} color={colors.primary} />
              <Text style={styles.emptyTitle}>Sin avistamientos en el mapa</Text>
              <Text style={styles.emptyText}>
                Identifica un ave con la cámara y el avistamiento aparecerá aquí con su coordenada GPS exacta
              </Text>
            </View>
          </View>
        )}
      </View>
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
      paddingBottom: 14,
      overflow: "hidden",
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
    mapContainer: {
      flex: 1,
    },
    emptyOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 28,
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    emptyTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 20,
    },
  });
}
