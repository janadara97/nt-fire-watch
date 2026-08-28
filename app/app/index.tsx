import { useState } from "react";
import MapView from "../components/MapView.web";
import HotspotCard from "../components/HotspotCard";
import {
  Show
} from "@clerk/expo";
import { SignInButton, UserButton, UserAvatar } from "@clerk/expo/web";
import { Text, View } from "react-native";

export default function Index() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <Show when="signed-out">
        <View style={styles.signedOutContainer}>
          <Text style={styles.title}>
            NT <Text style={styles.titleAccent}>Fire</Text>Watch
          </Text>
          <Text style={styles.tagline}>
            Real-time fire monitoring for the Northern Territory
          </Text>
          <SignInButton mode="modal">
            <View style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </View>
          </SignInButton>
        </View>
      </Show>
      <Show when="signed-in">
        <View style={{ flex: 1, position: "relative" }}>
          <View style={{ padding: 10, alignItems: "flex-end" }}>
            <UserButton />
          </View>
          <MapView onHotspotSelect={setSelectedHotspot} />
          {selectedHotspot && (
            <HotspotCard hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />
          )}
        </View>
      </Show>
    </View>
  );
}

const styles = {
  signedOutContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  titleAccent: {
    color: "#ff5a36",
  },
  tagline: {
    fontSize: 16,
    color: "#999",
    marginBottom: 32,
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: "#ff5a36",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    cursor: "pointer",
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
} as const;