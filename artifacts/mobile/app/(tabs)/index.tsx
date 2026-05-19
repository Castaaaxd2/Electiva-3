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

  const buttonScale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const handleCameraPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSequence(withSpring(0.94), withSpring(1));

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required to identify birds.");
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
      Alert.alert("Identification failed", "Could not analyze the image. Please try again.");
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
          <Text style={styles.tagline}>Point. Shoot. Discover.</Text>
          <Text style={styles.title}>BirdLens</Text>
        </Animated.View>

        {selectedImage ? (
          <Animated.View style={[styles.imageContainer, animatedImageStyle]} entering={FadeIn.duration(400)}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            {isAnalyzing && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.analyzingText}>Analyzing bird...</Text>
              </View>
            )}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.placeholder}>
            <View style={styles.placeholderInner}>
              <Ionicons name="camera" size={56} color={colors.primary} />
              <Text style={styles.placeholderTitle}>No photo yet</Text>
              <Text style={styles.placeholderText}>Take or upload a photo to identify a bird species</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actions}>
          <Animated.View style={animatedButtonStyle}>
            <Pressable
              style={[styles.primaryButton, isAnalyzing && styles.buttonDisabled]}
              onPress={handleCameraPress}
              disabled={isAnalyzing}
            >
              <LinearGradient
                colors={["#6FB3A0", "#5D9E8A"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Ionicons name="camera" size={22} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Open Camera</Text>
            </Pressable>
          </Animated.View>

          <Pressable
            style={[styles.secondaryButton, isAnalyzing && styles.buttonDisabled]}
            onPress={handleGalleryPress}
            disabled={isAnalyzing}
          >
            <Ionicons name="image-outline" size={20} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.tips}>
          <Text style={styles.tipsTitle}>Tips for best results</Text>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Ensure the bird is clearly visible and in focus</Text>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Good lighting improves accuracy significantly</Text>
          </View>
          <View style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>Capture distinctive markings like wing patterns</Text>
          </View>
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
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 120,
    },
    header: {
      marginTop: 16,
      marginBottom: 28,
    },
    tagline: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 36,
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
      marginBottom: 24,
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
      height: 260,
      borderRadius: colors.radius,
      overflow: "hidden",
      marginBottom: 24,
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
    actions: {
      gap: 12,
      marginBottom: 32,
    },
    primaryButton: {
      height: 58,
      borderRadius: colors.radius,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      overflow: "hidden",
    },
    primaryButtonText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    secondaryButton: {
      height: 52,
      borderRadius: colors.radius,
      borderWidth: 1.5,
      borderColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.softGreen,
    },
    secondaryButtonText: {
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
      padding: 20,
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
