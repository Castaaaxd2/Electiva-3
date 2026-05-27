import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState, useCallback, useRef } from "react";
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
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useBirdStore } from "@/context/BirdStore";
import { identifyBirdFromBase64, identifyBirdOffline } from "@/lib/birdApi";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


export default function IdentifyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addToHistory } = useBirdStore();
  const { isOffline } = useNetworkStatus();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedBase64, setSelectedBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cancelRef = useRef<{ aborted: boolean; controller: AbortController } | null>(null);

  const analyzeButtonScale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  const prepareImage = useCallback(async (rawUri: string) => {
    setIsProcessing(true);
    try {
      const context = ImageManipulator.ImageManipulator.manipulate(rawUri);
      context.resize({ width: 1024 });
      const rendered = await context.renderAsync();
      const prepared = await rendered.saveAsync({
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      });
      try { rendered.release?.(); } catch {}
      try { context.release?.(); } catch {}

      if (!prepared.base64) {
        throw new Error("La imagen no se pudo decodificar.");
      }
      setSelectedImage(prepared.uri);
      setSelectedBase64(prepared.base64);
      imageScale.value = withSequence(withTiming(0.95, { duration: 100 }), withSpring(1));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert("Error al procesar imagen", msg);
      setSelectedImage(null);
      setSelectedBase64(null);
    } finally {
      setIsProcessing(false);
    }
  }, [imageScale]);

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
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      await prepareImage(result.assets[0].uri);
    }
  }, [prepareImage]);

  const handleGalleryPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      await prepareImage(result.assets[0].uri);
    }
  }, [prepareImage]);

  const handleCancelAnalysis = useCallback(async () => {
    if (cancelRef.current) {
      cancelRef.current.aborted = true;
      cancelRef.current.controller.abort();
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAnalyzing(false);
  }, []);

  const handleAnalyzePress = useCallback(async () => {
    if (!selectedImage || !selectedBase64) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    analyzeButtonScale.value = withSequence(withSpring(0.94), withSpring(1));

    const controller = new AbortController();
    const cancelState = { aborted: false, controller };
    cancelRef.current = cancelState;

    setIsAnalyzing(true);
    try {
      const id = generateUUID();
      const base64ForAnalysis = selectedBase64;

      const locationPromise = (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return undefined;
        const pos = await Promise.race<Location.LocationObject | null>([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
        if (pos?.coords) {
          return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        }
        return undefined;
      })();

      const identifyPromise = isOffline
        ? identifyBirdOffline(selectedImage)
        : identifyBirdFromBase64(base64ForAnalysis, controller.signal);

      const [locationResult, identifyResult] = await Promise.allSettled([
        locationPromise,
        identifyPromise,
      ]);

      if (cancelState.aborted) return;
      if (identifyResult.status === "rejected") throw identifyResult.reason;

      const result = identifyResult.value;
      const location =
        locationResult.status === "fulfilled" ? locationResult.value : undefined;

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addToHistory({ ...result, id, imageBase64: base64ForAnalysis, location, analyzedAt: new Date().toISOString() });
      router.push({ pathname: "/result", params: { resultId: id } });
    } catch (err) {
      if (cancelState.aborted) return;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const errorMsg = err instanceof Error ? err.message : String(err);
      const msg = isOffline
        ? `No se pudo identificar localmente: ${errorMsg}`
        : `No se pudo analizar la imagen: ${errorMsg}`;
      Alert.alert("Identificación fallida", msg);
    } finally {
      cancelRef.current = null;
      setIsAnalyzing(false);
    }
  }, [selectedImage, selectedBase64, isOffline, addToHistory]);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setSelectedBase64(null);
  }, []);

  const styles = makeStyles(colors);

  const tabBarOffset =
    Platform.OS === "ios"
      ? 50 + insets.bottom
      : Platform.OS === "android"
        ? 60 + insets.bottom
        : 84;

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top }]}>
      <LinearGradient
        colors={["#EBF3D9", "#F4F7F0"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {isOffline && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.offlineBanner}>
          <Ionicons name="phone-portrait-outline" size={16} color="#FFFFFF" />
          <Text style={styles.offlineBannerText}>Sin conexión — usando modelo local</Text>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarOffset + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.tagline}>Apunta. Fotografía. Descubre.</Text>
          <Text style={styles.title}>BirdLens</Text>
        </Animated.View>

        {/* Imagen seleccionada */}
        {selectedImage ? (
          <Animated.View style={[styles.imageContainer, animatedImageStyle]} entering={FadeIn.duration(400)}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
              resizeMode="cover"
            />
            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.analyzingText}>Analizando especie...</Text>
                <Pressable style={styles.cancelButton} onPress={handleCancelAnalysis}>
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
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
              {isProcessing ? (
                <>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.placeholderTitle}>Procesando foto...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="camera" size={56} color={colors.primary} />
                  <Text style={styles.placeholderTitle}>Sin foto</Text>
                  <Text style={styles.placeholderText}>
                    Toma o sube una foto del ave para comenzar la identificación
                  </Text>
                </>
              )}
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
                  colors={isOffline ? ["#5B8A6A", "#4A7A5A"] : ["#92CA3A", "#80BA27"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {isAnalyzing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : isOffline ? (
                  <Ionicons name="phone-portrait-outline" size={22} color="#FFFFFF" />
                ) : (
                  <Ionicons name="scan" size={22} color="#FFFFFF" />
                )}
                <Text style={styles.analyzeButtonText}>
                  {isAnalyzing
                    ? isOffline
                      ? "Identificando localmente..."
                      : "Analizando..."
                    : isOffline
                      ? "Identificar offline"
                      : "Analizar especie"}
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        ) : (
          /* Sin foto: mostrar botones para obtener imagen */
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actions}>
            <Pressable style={styles.cameraButton} onPress={handleCameraPress}>
              <LinearGradient
                colors={["#92CA3A", "#80BA27"]}
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
    offlineBanner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "#6B7E6A",
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    offlineBannerText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: "#FFFFFF",
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
    cancelButton: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.18)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.5)",
    },
    cancelButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
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
      backgroundColor: "#80BA27",
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
      backgroundColor: "#80BA27",
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
