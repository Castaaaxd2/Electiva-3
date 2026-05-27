import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  isOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [state, setState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      setState(netState);
    });

    NetInfo.fetch().then(setState);

    return unsubscribe;
  }, []);

  const isConnected = state?.isConnected ?? true;
  const isInternetReachable = state?.isInternetReachable ?? null;
  const isOffline = isConnected === false || isInternetReachable === false;

  return { isConnected, isInternetReachable, isOffline };
}
