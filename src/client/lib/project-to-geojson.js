export default function projectToGeoJson(features) {
  const obj = {
    type: "FeatureCollection",
    features: features.map(feature => {
      const { type } = feature.geometry
      const { apiData, ...rest } = feature.properties
      const properties = { ...rest, ...apiData, type }
      return { ...feature, properties }
    }),
  }
  return JSON.stringify(obj, null, 2)
}
