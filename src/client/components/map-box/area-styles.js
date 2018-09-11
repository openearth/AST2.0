export default [
  {
    'id': 'area-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['has', 'user_color'],
    ],
    'paint': {
      'fill-color': {
      	'type': 'identity',
        'property': 'user_color',
      },
      'fill-outline-color': {
      	'type': 'identity',
        'property': 'user_color',
      },
      'fill-opacity': 0.1,
    },
  },
  {
    'id': 'area-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['has', 'user_color'],
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round',
    },
    'paint': {
      'line-color': {
      	'type': 'identity',
        'property': 'user_color',
      },
      'line-width': 4,
    },
  },
  {
    'id': 'area-polygon-stroke',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'true'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static'],
      ['has', 'user_color'],
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round',
    },
    'paint': {
      'line-color': {
      	'type': 'identity',
        'property': 'user_color',
      },
      'line-dasharray': [0.2, 2],
      'line-width': 2,
    },
  },
]
