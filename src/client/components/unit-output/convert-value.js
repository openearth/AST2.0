export default function convertValue(value, metricUnit) {
  switch (metricUnit) {
    case 'mm':
      // https://www.metric-conversions.org/length/centimeters-to-inches.htm
      return value * 0.39370
    case 'm':
      // https://www.metric-conversions.org/length/meters-to-feet.htm
      return value * 3.2808
    case 'm2':
      // https://www.metric-conversions.org/area/square-meters-to-square-feet.htm
      return value * 10.764
    case 'm3':
      // https://www.metric-conversions.org/volume/cubic-meters-to-cubic-feet.htm
      return value * 35.315
    case 'c':
      // https://www.metric-conversions.org/temperature/celsius-to-fahrenheit.htm
      return (value * 1.8000) + 32
    default:
      return `!${value}`
  }
}
