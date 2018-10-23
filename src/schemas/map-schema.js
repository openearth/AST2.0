const keys = ['default', 'satellite']
const labels = ['Default', 'Satellite']

export default {
  $id: '/map-schema',
  type: 'object',
  additionalProperties: false,
  properties: {
    center: {
      type: 'object',
      additionalProperties: false,
      required: ['lat', 'lng'],
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' },
      },
    },
    zoom: { type: 'number' },
    wmsLayers: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'showLegend', 'visible', 'opacity'],
        properties: {
          id: { type: 'string' },
          showLegend: { type: 'boolean' },
          visible: { type: 'boolean' },
          opacity: { type: 'number' },
        },
      },
    },
  },
}
