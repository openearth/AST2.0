import cloneDeep from 'lodash/cloneDeep'

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
  {
    'id': 'area-line-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
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
      'line-width': 2,
    },
  },
  {
    'id': 'area-line-active',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'true'],
      ['==', '$type', 'LineString'],
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

  {
    'id': 'area-point-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static'],
      ['has', 'user_color'],
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': {
      	'type': 'identity',
        'property': 'user_color',
      },
    },
  },
  {
    'id': 'area-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true'],
      ['has', 'user_color'],
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': {
      	'type': 'identity',
        'property': 'user_color',
      },
    },
  },
].reduce((list, style) => {
  const hiddenStyle = cloneDeep(style)
  const shownStyle = cloneDeep(style)
  hiddenStyle.id = `${hiddenStyle.id}-hidden`

  hiddenStyle.filter.push(['==', 'user_hidden', true])

  if (hiddenStyle.layout) {
    hiddenStyle.layout.visibility = 'none'
  } else {
    hiddenStyle.layout = { visibility: 'none' }
  }

  shownStyle.id = `${shownStyle.id}-shown`
  shownStyle.filter.push(['==', 'user_hidden', false])

  if (shownStyle.layout) {
    shownStyle.layout.visibility = 'visible'
  } else {
    shownStyle.layout = { visibility: 'visible' }
  }

  return [...list, hiddenStyle, shownStyle]
}, [])
