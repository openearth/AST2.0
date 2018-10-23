export default function projectToGeoJson(features) {
  const obj = {
    type: "FeatureCollection",
    features: features.map(feature => {
      const { apiData, ...rest } = feature.properties
      const properties = { ...rest, ...apiData }
      return { ...feature, properties }
    }),
  }
  return JSON.stringify(obj, null, 2)
}
