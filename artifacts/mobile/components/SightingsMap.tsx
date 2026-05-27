import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { BirdResult } from "@/context/BirdStore";

interface Props {
  sightings: BirdResult[];
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function SightingsMap({ sightings }: Props) {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.muted }]}>
      <Ionicons name="map-outline" size={48} color={colors.mutedForeground} />
      <Text style={{ fontSize: 15, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 8 }}>
        El mapa está disponible en la app móvil
      </Text>
      {sightings.length > 0 && (
        <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 4 }}>
          {sightings.length} avistamiento{sightings.length !== 1 ? "s" : ""} registrado{sightings.length !== 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
