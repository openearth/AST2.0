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
    layers: {
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

    wmsLayers: { type: 'array' }, // Leave in for backwards compatibility reasons
    mapLayers: { type: 'array' }, // Leave in for backwards compatibility reasons

    customLayers: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'showLegend', 'visible', 'opacity'],
        properties: {
          backgroundColor: { type: 'string' },
          deleteLayer: { type: 'boolean' },
          id: { type: 'string' },
          layerType: { type: 'string' },
          showLegend: { type: 'boolean' },
          tilesize: { type: 'number' },
          title: { type: 'string' },
          url: { type: 'string' },
          visible: { type: 'boolean' },
          opacity: { type: 'number' },
        },
      },
    },
    // Leave in for backwards compatibility reasons
    heatstressLayers: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'showLegend', 'visible', 'opacity'],
        properties: {
          id: { type: 'string' },
          key: { type: 'string' },
          layerType: { type: 'string' },
          tilesize: { type: 'number' },
          title: { type: 'string' },
          layerName: { type: 'string' },
          url: { type: 'string' },
          visible: { type: 'boolean' },
          legendUrl: { type: 'string' },
          opacity: { type: 'number' },
          showLegend: { type: 'boolean' },
        },
      },
    },
  },
}
