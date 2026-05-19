import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useBirdStore } from "@/context/BirdStore";
import { identifyBirdFromBase64 } from "@/lib/birdApi";

export default function IdentifyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addToHistory } = useBirdStore();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeButtonScale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  const animatedAnalyzeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: analyzeButtonScale.value }],
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const handleAnalyzePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    analyzeButtonScale.value = withSequence(withSpring(0.94), withSpring(1));

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la cámara para identificar aves.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      imageScale.value = withSequence(withTiming(0.95, { duration: 100 }), withSpring(1));
      if (asset.base64) {
        await analyzeImage(asset.base64);
      }
    }
  }, []);

  const handleGalleryPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      imageScale.value = withSequence(withTiming(0.95, { duration: 100 }), withSpring(1));
      if (asset.base64) {
        await analyzeImage(asset.base64);
      }
    }
  }, []);

  const analyzeImage = useCallback(async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const result = await identifyBirdFromBase64(base64);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addToHistory({ ...result, imageBase64: base64 });
      router.push({ pathname: "/result", params: { resultId: result.analyzedAt } });
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Identificación fallida", "No se pudo analizar la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToHistory]);

  const styles = makeStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top }]}>
      <LinearGradient
        colors={["#EDF4F1", "#F7F3EE"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.tagline}>Apunta. Fotografía. Descubre.</Text>
          <Text style={styles.title}>BirdLens</Text>
          <Text style={styles.subtitle}>32 especies identificables</Text>
        </Animated.View>

        {selectedImage ? (
          <Animated.View style={[styles.imageContainer, animatedImageStyle]} entering={FadeIn.duration(400)}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.analyzingText}>Analizando especie...</Text>
              </View>
            )}
            {!isAnalyzing && (
              <Pressable style={styles.retakeButton} onPress={handleAnalyzePress}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
                <Text style={styles.retakeText}>Nueva foto</Text>
              </Pressable>
            )}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.placeholder}>
            <View style={styles.placeholderInner}>
              <Ionicons name="camera" size={56} color={colors.primary} />
              <Text style={styles.placeholderTitle}>Sin foto</Text>
              <Text style={styles.placeholderText}>Toma o sube una foto para identificar una especie de ave</Text>
            </View>
          </Animated.View>
        )}

        {/* Botón principal: Analizar especie */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actions}>
          <Animated.View style={animatedAnalyzeStyle}>
            <Pressable
              style={[styles.analyzeButton, isAnalyzing && styles.buttonDisabled]}
              onPress={handleAnalyzePress}
              disabled={isAnalyzing}
            >
              <LinearGradient
                colors={["#6FB3A0", "#5D9E8A"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="scan" size={22} color="#FFFFFF" />
              )}
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? "Analizando..." : "Analizar especie"}
              </Text>
            </Pressable>
          </Animated.View>

          <Pressable
            style={[styles.galleryButton, isAnalyzing && styles.buttonDisabled]}
            onPress={handleGalleryPress}
            disabled={isAnalyzing}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <Text style={styles.galleryButtonText}>Elegir de la Galería</Text>
          </Pressable>
        </Animated.View>

        {/* Especies disponibles */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.speciesCard}>
          <Text style={styles.speciesCardTitle}>Especies del dataset</Text>
          <View style={styles.speciesGrid}>
            {BIRD_SPECIES_PREVIEW.map((name, i) => (
              <View key={i} style={styles.speciesChip}>
                <Text style={styles.speciesChipText}>{name}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.tips}>
          <Text style={styles.tipsTitle}>Consejos para mejores resultados</Text>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Asegúrate de que el ave sea claramente visible y esté enfocada</Text>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Una buena iluminación mejora significativamente la precisión</Text>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Captura marcas distintivas como patrones de alas</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const BIRD_SPECIES_PREVIEW = [
  "Canario costeño", "Caracara plancus", "Carpinterito Oliváceo",
  "Copetón", "Cucarachero común", "Colibrí Cola Canela",
  "Garza ganadera", "Gavilán caminero", "Luis Bienteveo",
  "Loro Cabeciazul", "Mirla patinaranja", "Perico carisucio",
  "Tangara Azulegris", "Tangara dorada", "Tirano Pirirí",
  "Tortolita común", "Zorzal Sabiá", "+ 15 más...",
];

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 120,
    },
    header: {
      marginTop: 16,
      marginBottom: 24,
    },
    tagline: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 34,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginTop: 4,
    },
    subtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    placeholder: {
      height: 220,
      borderRadius: colors.radius,
      backgroundColor: colors.card,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: colors.border,
      borderStyle: "dashed",
      marginBottom: 20,
    },
    placeholderInner: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    placeholderTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    placeholderText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      paddingHorizontal: 32,
    },
    imageContainer: {
      height: 240,
      borderRadius: colors.radius,
      overflow: "hidden",
      marginBottom: 20,
    },
    selectedImage: {
      width: "100%",
      height: "100%",
    },
    analyzingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    analyzingText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: "Inter_500Medium",
    },
    retakeButton: {
      position: "absolute",
      bottom: 12,
      right: 12,
      backgroundColor: "rgba(0,0,0,0.5)",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
    },
    retakeText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    actions: {
      gap: 10,
      marginBottom: 24,
    },
    analyzeButton: {
      height: 62,
      borderRadius: colors.radius,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      overflow: "hidden",
    },
    analyzeButtonText: {
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      letterSpacing: 0.3,
    },
    galleryButton: {
      height: 50,
      borderRadius: colors.radius,
      borderWidth: 1.5,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.softGreen,
    },
    galleryButtonText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    speciesCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
      gap: 12,
    },
    speciesCardTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    speciesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    speciesChip: {
      backgroundColor: colors.softGreen,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    speciesChipText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.primary,
    },
    tips: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 18,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tipsTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
    },
    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    tipDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.coral,
      marginTop: 6,
    },
    tipText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
    },
  });
}
