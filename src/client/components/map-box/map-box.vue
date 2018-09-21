<template>
  <div ref="map" class="map"/>
</template>

<script>
import MapEventBus, { UPDATE_FEATURE_PROPERTY, REDRAW } from '../../lib/map-event-bus'
import projectAreaStyles from './project-area-styles'
import areaStyles from './area-styles'

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
  },

  watch: {
    activeStyle() {
      this.map.setStyle(this.activeStyle)
    },
  },

  async mounted() {
    const [mapboxgl, MapboxDraw] = await Promise.all([import('mapbox-gl'), import('@mapbox/mapbox-gl-draw')])
    const defaultStyles = [...new MapboxDraw().options.styles]
      .filter(style => /\.hot$/.test(style.id))
      .map(({ source, ...style }) => ({ ...style, id: style.id.replace('.hot', '') }))

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: this.activeStyle,
      zoom: 16.5,
      center: [4.916535879906178, 52.36599335162853],
      showZoom: true,
    })
    this.draw = new MapboxDraw({
      controls: { combine_features: false, uncombine_features: false },
      userProperties: true,
      styles: [...defaultStyles, ...projectAreaStyles, ...areaStyles],
    })
    this.navigationControls = new mapboxgl.NavigationControl({ showCompass: false })

    this.map.addControl(this.navigationControls, 'bottom-right')
    this.map.addControl(this.draw, 'top-left')

    this.initialShapes.forEach(shape => {
      this.draw.add(shape)
    })

    this.map.on('draw.create', event => this.$emit('create', event.features))
    this.map.on('draw.update', event => this.$emit('update', event.features))
    this.map.on('draw.delete', event => this.$emit('delete', event.features))
    this.map.on('draw.selectionchange', event => this.$emit('selectionchange', event.features))

    this.map.on('load', () => {
      this.map.resize()
    })

    MapEventBus.$on(UPDATE_FEATURE_PROPERTY, ({ featureId, key, value }) => {
      const updatedFeature = this.draw.setFeatureProperty(featureId, key, value).get(featureId)
      // console.log({ key, value, updatedFeature }) // Comment left on purpose for easy debugging
    })

    MapEventBus.$on(REDRAW, () => {
      this.map.resize()
    })
  },
}
</script>

<style>
.map {
  width: 100%;
  height: 100%;
}
</style>
