<template>
  <div ref="map" class="map"/>
</template>

<script>
import projectAreaStyles from './project-area-styles'
import areaStyles from './area-styles'
import MapEventBus, {
  UPDATE_FEATURE_PROPERTY,
  REDRAW,
  REPOSITION,
  RELOAD_LAYERS,
  MODE,
  DELETE,
  ZOOM_IN,
  ZOOM_OUT,
  SELECT,
  SEARCH,
  SEARCH_SUGGESTIONS,
  FLY_TO,
} from '../../lib/map-event-bus'

export default {
  props: {
    initialShapes: {
      type: Array,
      default: () => [],
    },
    activeBaseLayer: {
      type: String,
      required: true,
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    point: {
      type: Boolean,
      default: true,
    },
    line: {
      type: Boolean,
      default: true,
    },
    polygon: {
      type: Boolean,
      default: true,
    },
    isProject: {
      type: Boolean,
      required: true,
    },
    projectArea: {
      type: Object,
      default: () => {},
    },
    areas: {
      type: Array,
      default: () => [],
    },
    mapZoom: {
      type: Number,
      default: 0,
    },
    mapCenter: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
    },
  },

  data: () => ({
    map: undefined,
    draw: undefined,
    navigationControls: undefined,
    styles: {
      default: 'mapbox://styles/mapbox/streets-v9',
      satellite: 'mapbox://styles/mapbox/satellite-v9',
    },
  }),

  computed: {
    activeStyle() {
      return this.styles[this.activeBaseLayer]
    },
    hasProjectArea() {
      return !!this.projectArea.properties
    },
  },

  watch: {
    activeStyle() {
      this.map.setStyle(this.activeStyle)
    },
  },

  async mounted() {
    const mapZoom = this.mapZoom
    const { lat, lng } = this.mapCenter
    const [mapboxgl, MapboxDraw, MapboxGeocoder] = await Promise.all([import('mapbox-gl'), import('@mapbox/mapbox-gl-draw'), import('@mapbox/mapbox-gl-geocoder')])
    const defaultStyles = [...new MapboxDraw().options.styles]
      .filter(style => /\.hot$/.test(style.id))
      .map(({ source, ...style }) => ({ ...style, id: style.id.replace('.hot', '') }))
      .map(style => {
        style.filter.push(['!has', 'user_measure'])
        return style
      })
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    if (this.$refs.map) {
      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: this.activeStyle,
        zoom: this.mapZoom,
        center: [lng, lat],
        showZoom: false,
      })
      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        userProperties: true,
        styles: [...defaultStyles, ...projectAreaStyles, ...areaStyles],
      })
      this.navigationControls = new mapboxgl.NavigationControl({ showCompass: false })
      this.geoCoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken })
      this.geoCoder.on('results', ({ features }) => {
        MapEventBus.$emit(SEARCH_SUGGESTIONS, features)
      })

      this.map.addControl(this.navigationControls, 'bottom-right')
      this.map.addControl(this.draw, 'top-left')
      this.map.addControl(this.geoCoder)

      this.initialShapes.forEach(shape => {
        this.draw.add(shape)
      })

      this.map.on('draw.create', event => this.$emit('create', event.features))
      this.map.on('draw.update', event => this.$emit('update', event.features))
      this.map.on('draw.delete', event => this.$emit('delete', event.features))
      this.map.on('draw.selectionchange', event => this.$emit('selectionchange', event.features))
      this.map.on('move', event => this.$emit('move', { center: this.map.getCenter(), zoom: this.map.getZoom() }))
      this.map.on('draw.modechange', event => this.$emit('modechange', event.mode))

      this.map.on('load', () => {
        this.map.resize()
        this.fillMap()
        this.$emit('modechange', this.draw.getMode())
      })

      MapEventBus.$on(UPDATE_FEATURE_PROPERTY, ({ featureId, key, value }) => {
        if (this.draw.get(featureId) !== undefined) {
          const updatedFeature = this.draw.setFeatureProperty(featureId, key, value).get(featureId)
          // console.log({ key, value, updatedFeature }) // Comment left on purpose for easy debugging
        }
      })

      MapEventBus.$on(REDRAW, () => {
        this.map.resize()
      })

      MapEventBus.$on(SEARCH, (value) => {
        this.geoCoder.setInput(value).query(value)
      })

      MapEventBus.$on(REPOSITION, ({ center, zoom }) => {
        this.$nextTick(() => this.map.flyTo({ center, zoom }))
      })

      MapEventBus.$on(RELOAD_LAYERS, () => {
        this.clearMap()
        this.$nextTick(this.fillMap)
      })

      MapEventBus.$on(MODE, this.draw.changeMode)

      MapEventBus.$on(DELETE, () => {
        const { features } = this.draw.getSelected()
        const ids = features.map(({ id }) => id)
        this.$emit('delete', features)
        this.draw.delete(ids)
      })

      MapEventBus.$on(ZOOM_IN, () => this.map.zoomIn())
      MapEventBus.$on(ZOOM_OUT, () => this.map.zoomOut())

      MapEventBus.$on(SELECT, (id) => {
        if (id) {
          this.draw.changeMode('direct_select', { featureId: id })
        }
      })
    }
  },
  beforeDestroy() {
    MapEventBus.$off()
  },
  methods: {
    clearMap() {
      this.map.getLayer('projectArea-line') && this.map.removeLayer('projectArea-line')
      this.map.getSource('projectArea-line') && this.map.removeSource('projectArea-line')
      this.draw.deleteAll()
    },
    fillMap() {
      if (!this.interactive) {
        this.hasProjectArea && this.addGeojsonLayer({ ...this.projectArea, id: 'projectArea' })
        this.areas.forEach(area => this.addGeojsonLayer(area))
        return
      }

      if (this.isProject) {
        this.hasProjectArea && this.addGeojsonLayer({ ...this.projectArea, id: 'projectArea' })
        this.areas.forEach(area => this.draw.add(area))
      } else {
        this.areas.forEach(area => this.addGeojsonLayer(area))
        this.hasProjectArea && this.draw.add(this.projectArea)
      }
    },
    addGeojsonLayer({ properties = {}, type, geometry, id }) {
      const color = id === 'projectArea'
        ? projectAreaStyles[0].paint['fill-color']
        : properties.color

      const lineDetails = {
        id: `${properties.name || id}-line`,
        type: 'line',
        paint: {
          'line-color': color || '#088',
          'line-width': id === 'projectArea' ? 5 : 3,
        },
      }
      const fillDetails = {
        id: `${properties.name || id}-fill`,
        type: 'fill',
        paint: {
          'fill-color': color || '#088',
          'fill-opacity': id === 'projectArea' ? 0 : 0.1,
        },
      }
      const baseObj = {
        'source': {
          'type': 'geojson',
          'data': {
            'type': type,
            'geometry': {
              'type': geometry.type,
              'coordinates': geometry.coordinates,
            },
          },
        },
        'layout': {},
      }
      const line = Object.assign({}, baseObj, lineDetails)
      // const fill = Object.assign({}, baseObj, fillDetails)
      // this.map.addLayer(fill)
      this.map.addLayer(line)
    },
  },
}
</script>
