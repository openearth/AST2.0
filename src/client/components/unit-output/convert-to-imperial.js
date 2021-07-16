export default function convertToImperial(value, unitKey) {
  switch (unitKey) {
    case 'DistanceMM':
    case 'Ratemmy':
      // https://www.metric-conversions.org/length/centimeters-to-inches.htm
      return value * 0.39370
    case 'distance':
      // https://www.metric-conversions.org/length/meters-to-feet.htm
      return value * 3.2808
    case 'surface':
      // https://www.metric-conversions.org/area/square-meters-to-square-feet.htm
      return value * 10.764
    case 'volume':
      // https://www.metric-conversions.org/volume/cubic-meters-to-cubic-feet.htm
      return value * 35.315
    case 'temperature':
      // https://www.metric-conversions.org/temperature/celsius-to-fahrenheit.htm
      return (value * 1.8000) + 32
    default:
      return value
  }
}
