import { View, Text, Pressable } from "react-native"

export default function HotspotCard({ hotspot, onClose }) {
  const { datetime, hours, confidence, satellite } = hotspot.properties
  const [longitude, latitude] = hotspot.geometry.coordinates

  return (
    <View style={styles.card}>
      <Pressable onPress={onClose}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
      <Text style={styles.title}>Hotspot Details</Text>
      <Text style={styles.row}>Detected: {new Date(datetime).toLocaleString()}</Text>
      <Text style={styles.row}>Hours since detected: {hours}</Text>
      <Text style={styles.row}>Confidence: {confidence}</Text>
      <Text style={styles.row}>Satellite: {satellite}</Text>
      <Text style={styles.row}>Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}</Text>
    </View>
  )
}

const styles = {
  card: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "white",
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    padding: 16,
    zIndex: 1000,
  },
  closeText: {
    alignSelf: "flex-end",
    color: "#007AFF",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    marginBottom: 8,
  },
}
