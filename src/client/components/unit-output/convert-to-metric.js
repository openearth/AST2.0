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
      // Based on:
      // https://www.metric-conversions.org/temperature/fahrenheit-to-celsius.htm
      // However, the subtraction of 32 is left out since we only care about
      // relative temperatures
      return value / 1.8000
    default:
      return value
  }
}
