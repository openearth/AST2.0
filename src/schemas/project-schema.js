export default {
  $id: '/project-root',
  type: 'object',
  additionalProperties: false,
  required: [
    'legalAccepted',
    'areas',
    'settings',
    'map',
  ],
  properties: {
    legalAccepted: { type: 'boolean' },
    areas: { type: 'array', items: { $ref: '/area-feature' } },
    settings: { $ref: '/settings-schema' },
    map: { $ref: '/map-schema' },
    rivmCoBenefits: { type: "object" },
  },
}
