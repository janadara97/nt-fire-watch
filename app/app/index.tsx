import { useState } from "react";
import MapView from "../components/MapView.web";
import HotspotCard from "../components/HotspotCard";
import FireHotspotWeb from "../components/FireHotspotWeb";
import { useAuth } from "@clerk/expo";
import { SignInButton, UserButton } from "@clerk/expo/web";
import { StyleSheet, Text, View } from "react-native";
import NeuronNetwork from "@/components/NeuronNetwork";

export default function Index() {
    const [selectedHotspot, setSelectedHotspot] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const { isSignedIn } = useAuth();

    const showMap = isSignedIn || isGuest;

    return (
        <View style={{ flex: 1 }}>
            {!showMap && (
                <View style={styles.signedOutContainer}>
                    <NeuronNetwork />

                    <View style={styles.statusPill}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>
                            Live satellite monitoring
                        </Text>
                    </View>

                    <Text style={styles.title}>NT FireWatch</Text>
                    <Text style={styles.tagline}>
                        Near real-time satellite hotspot tracking across the
                        Northern Territory.
                    </Text>

                    <SignInButton mode="modal">
                        <View style={styles.signInButton}>
                            <Text style={styles.signInButtonText}>Sign in</Text>
                        </View>
                    </SignInButton>

                    <View style={styles.guestButton}>
                        <Text
                            style={styles.guestButtonText}
                            onPress={() => setIsGuest(true)}
                        >
                            Continue as guest
                        </Text>
                    </View>
                </View>
            )}

            {showMap && (
                <View style={{ flex: 1, position: "relative" }}>
                    <View style={{ padding: 10, alignItems: "flex-end" }}>
                        {isSignedIn ? (
                            <UserButton />
                        ) : (
                            <SignInButton mode="modal">
                                <View style={styles.signInButtonSmall}>
                                    <Text style={styles.signInButtonText}>
                                        Sign in
                                    </Text>
                                </View>
                            </SignInButton>
                        )}
                    </View>
                    <MapView onHotspotSelect={setSelectedHotspot} />
                    {selectedHotspot && (
                        <HotspotCard
                            hotspot={selectedHotspot}
                            onClose={() => setSelectedHotspot(null)}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    signedOutContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0A0908",
        padding: 24,
        overflow: "hidden",
    },
    statusPill: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(251, 191, 36, 0.35)",
        backgroundColor: "rgba(251, 191, 36, 0.08)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        marginBottom: 20,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#FBBF24",
        marginRight: 8,
    },
    statusText: { color: "#FCD34D", fontSize: 13 },
    title: {
        fontSize: 42,
        fontWeight: "700",
        color: "#FAF9F6",
        letterSpacing: 0.5,
        marginBottom: 14,
    },
    tagline: {
        fontSize: 16,
        color: "#B8B2A8",
        marginBottom: 36,
        textAlign: "center",
        maxWidth: 340,
        lineHeight: 22,
    },
    signInButton: {
        backgroundColor: "#EA580C",
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 8,
        cursor: "pointer",
    },
    signInButtonSmall: {
        backgroundColor: "#EA580C",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        cursor: "pointer",
    },
    signInButtonText: { color: "#FFF7ED", fontWeight: "700", fontSize: 16 },
    guestButton: {
        marginTop: 16,
        cursor: "pointer",
    },
    guestButtonText: {
        color: "#B8B2A8",
        fontSize: 14,
        textDecorationLine: "underline",
    },
});
