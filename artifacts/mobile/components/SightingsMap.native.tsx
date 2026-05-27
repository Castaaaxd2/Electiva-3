import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

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

export default function SightingsMap({ sightings, initialRegion }: Props) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {sightings.map((sighting, i) => (
        <Marker
          key={sighting.id ?? String(i)}
          coordinate={{
            latitude: sighting.location!.latitude,
            longitude: sighting.location!.longitude,
          }}
          title={sighting.topPrediction.commonName}
          description={`${sighting.topPrediction.confidence.toFixed(0)}% confianza · ${new Date(sighting.analyzedAt).toLocaleDateString("es-ES")}`}
          onCalloutPress={() =>
            router.push({
              pathname: "/result",
              params: { resultId: sighting.id ?? sighting.analyzedAt },
            })
          }
        />
      ))}
    </MapView>
  );
}
