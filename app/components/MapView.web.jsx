import { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { fetchHotspots } from "../services/api"
import "leaflet/dist/leaflet.css"


function colourForHours(hours) {
  if(hours <6 ) return "red"
  if(hours <12 ) return "orange"
  if(hours <24 ) return "yellow"
  return "blue" 
}

export default function MapView() {
  const [hotspots, setHotspots] = useState([])


  useEffect(() => {
    fetchHotspots().then(setHotspots)
  }, [])

  return (
    <MapContainer center={[-19, 133]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hotspots.features?.filter(f => f.geometry?.coordinates).map((feature, index) => (
        <CircleMarker
          key={index}
          center={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          radius={8}
          pathOptions={{ 
            color: colourForHours(feature.properties.hours),
            fillColor: colourForHours(feature.properties.hours),
            fillOpacity: 0.8
          }}
        >
          <Popup>
            Confidence: {feature.properties.confidence}
            {"\n"}
            Hours: {feature.properties.hours}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
