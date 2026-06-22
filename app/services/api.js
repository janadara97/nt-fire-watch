import {toFeatureCollection} from "./transformers"
const API_URL = process.env.EXPO_PUBLIC_API_URL

async function apiGET(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

export async function fetchHotspots() {
  const data = await apiGET("/api/hotspot")
  return toFeatureCollection(data)
}
