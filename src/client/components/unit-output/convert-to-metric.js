export default function convertToMetric(value, unitKey) {
  switch (unitKey) {
    case 'DistanceMM':
    case 'Ratemmy':
      // https://www.metric-conversions.org/length/inches-to-centimeters.htm
      return value / 0.39370
    case 'distance':
      // https://www.metric-conversions.org/length/feet-to-meters.htm
      return value / 3.2808
    case 'surface':
      // https://www.metric-conversions.org/area/square-feet-to-square-meters.htm
      return value / 10.764
    case 'volume':
      // https://www.metric-conversions.org/volume/cubic-feet-to-cubic-meters.htm
      return value / 35.315
    case 'temperature':
      // https://www.metric-conversions.org/temperature/fahrenheit-to-celsius.htm
      return (value - 32) / 1.8000
    default:
      return value
  }
}
