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
  FadeInUp,
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
  const [selectedBase64, setSelectedBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeButtonScale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  const animatedAnalyzeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: analyzeButtonScale.value }],
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const handleCameraPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la cámara para tomar fotos.");
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
      setSelectedBase64(asset.base64 ?? null);
      imageScale.value = withSequence(withTiming(0.95, { duration: 100 }), withSpring(1));
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
      setSelectedBase64(asset.base64 ?? null);
      imageScale.value = withSequence(withTiming(0.95, { duration: 100 }), withSpring(1));
    }
  }, []);

  const handleAnalyzePress = useCallback(async () => {
    if (!selectedBase64) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    analyzeButtonScale.value = withSequence(withSpring(0.94), withSpring(1));

    setIsAnalyzing(true);
    try {
      const result = await identifyBirdFromBase64(selectedBase64);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addToHistory({ ...result, imageBase64: selectedBase64 });
      router.push({ pathname: "/result", params: { resultId: result.analyzedAt } });
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Identificación fallida", "No se pudo analizar la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedBase64, addToHistory]);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setSelectedBase64(null);
  }, []);

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
        </Animated.View>

        {/* Imagen seleccionada */}
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
              <Pressable style={styles.resetButton} onPress={handleReset}>
                <Ionicons name="close" size={16} color="#FFFFFF" />
                <Text style={styles.resetText}>Cambiar foto</Text>
              </Pressable>
            )}
          </Animated.View>
        ) : (
          /* Placeholder cuando no hay foto */
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.placeholder}>
            <View style={styles.placeholderInner}>
              <Ionicons name="camera" size={56} color={colors.primary} />
              <Text style={styles.placeholderTitle}>Sin foto</Text>
              <Text style={styles.placeholderText}>
                Toma o sube una foto del ave para comenzar la identificación
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Botones: cambia según si hay foto o no */}
        {selectedImage ? (
          /* Con foto: mostrar botón "Analizar especie" */
          <Animated.View entering={FadeInUp.duration(400)} style={styles.actions}>
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
          </Animated.View>
        ) : (
          /* Sin foto: mostrar botones para obtener imagen */
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actions}>
            <Pressable style={styles.cameraButton} onPress={handleCameraPress}>
              <LinearGradient
                colors={["#6FB3A0", "#5D9E8A"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Ionicons name="camera" size={22} color="#FFFFFF" />
              <Text style={styles.cameraButtonText}>Abrir Cámara</Text>
            </Pressable>

            <Pressable style={styles.galleryButton} onPress={handleGalleryPress}>
              <Ionicons name="image-outline" size={20} color={colors.primary} />
              <Text style={styles.galleryButtonText}>Elegir de la Galería</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Consejos — solo visibles cuando no hay foto */}
        {!selectedImage && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.tips}>
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
        )}
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
    placeholder: {
      height: 240,
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
      height: 280,
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
    resetButton: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "rgba(0,0,0,0.5)",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
    },
    resetText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    actions: {
      gap: 10,
      marginBottom: 24,
    },
    analyzeButton: {
      height: 64,
      borderRadius: colors.radius,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      overflow: "hidden",
    },
    analyzeButtonText: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      letterSpacing: 0.3,
    },
    cameraButton: {
      height: 58,
      borderRadius: colors.radius,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      overflow: "hidden",
    },
    cameraButtonText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
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
