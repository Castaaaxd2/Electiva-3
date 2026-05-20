import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface BirdPrediction {
  species: string;
  commonName: string;
  scientificName: string;
  confidence: number;
}

export interface BirdLocation {
  latitude: number;
  longitude: number;
}

export interface BirdResult {
  id: string;
  topPrediction: BirdPrediction;
  allPredictions: BirdPrediction[];
  description: string;
  habitat: string;
  diet: string;
  conservationStatus: string;
  imageBase64?: string;
  analyzedAt: string;
  location?: BirdLocation;
}

interface BirdStoreContextType {
  history: BirdResult[];
  addToHistory: (result: BirdResult) => void;
  clearHistory: () => void;
}

const BirdStoreContext = createContext<BirdStoreContextType | null>(null);

const STORAGE_KEY = "@birdlens_history";
const MAX_HISTORY = 50;

export function BirdStoreProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<BirdResult[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as BirdResult[];
          setHistory(parsed);
        }
      })
      .catch(() => {});
  }, []);

  const save = useCallback(async (items: BirdResult[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, []);

  const addToHistory = useCallback(
    (result: BirdResult) => {
      setHistory((prev) => {
        const next = [result, ...prev].slice(0, MAX_HISTORY);
        save(next);
        return next;
      });
    },
    [save]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  return (
    <BirdStoreContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </BirdStoreContext.Provider>
  );
}

export function useBirdStore() {
  const ctx = useContext(BirdStoreContext);
  if (!ctx) throw new Error("useBirdStore must be used within BirdStoreProvider");
  return ctx;
}
