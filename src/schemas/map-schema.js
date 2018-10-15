const keys = ['default', 'satellite']
const labels = ['Default', 'Satellite']

export default {
  $id: '/map-schema',
  type: 'object',
  additionalProperties: false,
  required: ['activeBaseLayer', 'baseLayers'],
  properties: {
    activeBaseLayer: { type: 'string', enum: keys },
    baseLayers: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['key', 'label'],
        properties: {
          key: { type: 'string', enum: keys },
          label: { type: 'string', enum: labels },
        },
      },
    },
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
        required: ['id', 'showLegend', 'visible'],
        properties: {
          id: { type: 'string' },
          showLegend: { type: 'boolean' },
          visible: { type: 'boolean' },
        },
      },
    },
  },
}
