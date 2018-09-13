export default [
  {
    'id': 'project-area-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['==', 'user_isProjectArea', true],
    ],
    'paint': {
      'fill-color': '#ffff00',
      'fill-outline-color': '#ffff00',
      'fill-opacity': 0.1,
    },
  },
  {
    'id': 'project-area-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['==', 'user_isProjectArea', true],
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round',
    },
    'paint': {
      'line-color': '#ffff00',
      'line-width': 4,
    },
  },
]
