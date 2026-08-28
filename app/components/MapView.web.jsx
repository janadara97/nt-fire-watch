import { use, useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import L from "leaflet"
import { fetchHotspots } from "../services/api"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import { useAuth } from "@clerk/expo"


function colourForHours(hours) {
  if(hours <6 ) return "red"
  if(hours <12 ) return "orange"
  if(hours <24 ) return "yellow"
  return "blue"
}

function hotspotIcon(hours) {
  const color = colourForHours(hours)
  return L.divIcon({
    className: "",
    html: `<div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${color}; opacity: 0.8; border: 1px solid rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function MapView({ onHotspotSelect }) {
  const [hotspots, setHotspots] = useState([])
  const {getToken} = useAuth()


  useEffect(() =>  {
    async function load() {
      const token = await getToken();
      const data = await fetchHotspots(token)
      setHotspots(data)
    }
    load()
  }, [])

  return (
    <MapContainer center={[-19, 133]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup chunkedLoading>
        {hotspots.features?.filter(f => f.geometry?.coordinates).map((feature) => (
          <Marker
            key={feature.properties.id}
            position={[
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ]}
            icon={hotspotIcon(feature.properties.hours)}
            eventHandlers={{
              click: () => onHotspotSelect(feature),
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
