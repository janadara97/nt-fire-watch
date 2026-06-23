import {toFeatureCollection} from "./transformers"
const API_URL = process.env.EXPO_PUBLIC_API_URL

async function apiGET(endpoint, token) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

export async function fetchHotspots(token) {
  const data = await apiGET("/api/hotspot", token)
  return toFeatureCollection(data)
}
