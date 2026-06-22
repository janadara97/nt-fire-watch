export function toFeatureCollection(rows) {
  return {
    type: "FeatureCollection",
    features: rows.map(row => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        id: row.id,
        datetime: row.datetime,
        hours: row.hours,
        confidence: row.confidence,
        satellite: row.satellite,
      }
    }))
  }
}
