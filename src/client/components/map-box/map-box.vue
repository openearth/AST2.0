<template>
  <div ref="map" class="map" />
</template>

<script>
import { mapActions } from 'vuex'
import get from 'lodash/get'
import projectAreaStyles from './project-area-styles'
import areaStyles from './area-styles'
import getData from '~/lib/get-data'
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
  REPAINT,
  DELETE_LAYER,
} from '../../lib/map-event-bus'
import log from '../../lib/log'

export default {
  props: {
    initialShapes: {
      type: Array,
      default: () => [],
    },
    addOnly: {
      type: Boolean,
      default: false,
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
    mode: {
      type: String,
      default: '',
    },
    mapZoom: {
      type: Number,
      default: 0,
    },
    mapCenter: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
    },
    customLayers: {
      type: Array,
      default: () => [],
    },
    layerList: {
      type: Array,
      default: () => [],
    },
    fitToBounds: {
      type: Array,
      default: () => [],
    },
    animate: {
      type: Boolean,
      default: true,
    },
    heatstressLayers: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    map: undefined,
    draw: undefined,
    oldHeatstressLayers: [], // Needed for recalculation and resetting the wmslayers for heatstress
  }),

  computed: {
    allMapLayers() {
      const layers = [ ...this.customLayers, ...this.layerList ]
      return layers
    },
    hasProjectArea() {
      return !!get(this, 'projectArea.properties')
    },
    layerVisibility() {
      return this.allMapLayers.reduce((obj, layer) => {
        obj[`${layer.id}-${layer.title}`] = layer.visible
        return obj
      }, {})
    },
    layerOpacity() {
      return this.allMapLayers.reduce((obj, layer) => {
        obj[`${layer.id}-${layer.title}`] = layer.opacity
        return obj
      }, {})
    },
  },

  watch: {
    layerVisibility() {
      this.renderWmsLayersVisibility()
    },
    layerOpacity() {
      this.renderWmsLayersOpacity()
    },
    mode() {
      this.clearMap()
      this.$nextTick(this.fillMap)
    },
    customLayers() {
      [...this.customLayers].reverse().forEach(this.addWmsLayer)
    },
    layerList() {
      [...this.layerList].reverse().forEach(this.addWmsLayer)
    },
    fitToBounds() {
      if (this.fitToBounds.length > 0) {
        this.map.fitBounds(this.fitToBounds, { padding: 20, animate: this.animate })
      }
    },
    heatstressLayers: {
      deep: true,
      handler(newLayers) {
        const layers = [...newLayers].reverse().forEach(newLayer => {
          if (!this.map.getLayer(`wms-layer-${newLayer.id}`)) {
            this.addWmsLayer(newLayer)
          }

          if (newLayer.visible === true) {
            this.showWmsLayer(newLayer.id)
          } else {
            this.hideWmsLayer(newLayer.id)
          }
          // Find the old layer with the same ID
          const oldLayer = this.oldHeatstressLayers.find(
            oldLayer => oldLayer.title === newLayer.title,
          )

          if (oldLayer && oldLayer.layerName !== newLayer.layerName) {
            // if there is already an old layer with this id, remove it first
            if (this.map.getLayer(`wms-layer-${oldLayer.id}`)) {
              this.removeWmsLayer(oldLayer.id)
            }
          }
        })
        if (newLayers.length > 0 ) {
          this.oldHeatstressLayers = newLayers
        }
        return layers
      },
    },
  },

  async mounted() {
    const { lat, lng } = this.mapCenter
    const [mapboxgl, MapboxDraw, MapboxGeocoder, mapboxBaseStyle] = await Promise.all([import('mapbox-gl'), import('@mapbox/mapbox-gl-draw'),
      import('@mapbox/mapbox-gl-geocoder'), getData({ folder: 'mapbox-base-layer', slug: 'style' })])
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
        style: mapboxBaseStyle,
        zoom: this.mapZoom,
        center: [lng, lat],
        showZoom: false,
        preserveDrawingBuffer: true,
      })
      window.map = this.map
      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        userProperties: true,
        styles: [...defaultStyles, ...projectAreaStyles, ...areaStyles],
      })

      this.geoCoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken, flyTo: false })
      this.geoCoder.on('results', ({ features }) => {
        MapEventBus.$emit(SEARCH_SUGGESTIONS, features)
      })

      this.initialShapes.forEach(shape => {
        this.draw.add(shape)
      })

      this.map.on('draw.create', event => this.$emit('create', event.features))
      this.map.on('draw.update', event => this.$emit('update', event.features))
      this.map.on('draw.delete', event => this.$emit('delete', event.features))
      this.map.on('draw.selectionchange', event => this.$emit('selectionchange', event.features))
      this.map.on('drag', () => this.$emit('move', { center: this.map.getCenter(), zoom: this.map.getZoom() }))
      this.map.on('draw.modechange', event => this.$emit('modechange', event.mode))
      this.map.on('draw.render', () => this.$emit('render'))

      this.map.on('load', () => {
        this.allMapLayers.forEach(this.addWmsLayer)
        this.map.resize()
        this.map.addControl(this.draw, 'top-left')
        this.map.addControl(this.geoCoder)
        this.fillMap()
        this.renderWmsLayersVisibility()
        this.renderWmsLayersOpacity()
        this.$emit('modechange', this.draw.getMode())
        this.$nextTick(() => {
          // We dispatch an custom event so that the iframe for the export-to-pdf
          // functionality knows when mapbox has loaded
          document.dispatchEvent(new CustomEvent('mapbox-loaded'))
        })
      })

      MapEventBus.$on(UPDATE_FEATURE_PROPERTY, ({ featureId, key, value }) => {
        if (this.draw.get(featureId) !== undefined) {
          this.draw.setFeatureProperty(featureId, key, value).get(featureId)  // @REFACTOR :: Can this getter be removed?
        }
      })

      MapEventBus.$on(REDRAW, () => {
        this.map.resize()
      })

      MapEventBus.$on(SEARCH, value => {
        this.geoCoder.setInput(value).query(value)
      })

      MapEventBus.$on(REPOSITION, ({ center, zoom, instant = false }) => {
        if (instant) {
          this.$nextTick(() => this.map.jumpTo({ center, zoom, animate: this.animate }))
        } else {
          this.$nextTick(() => this.map.flyTo({ center, zoom, animate: this.animate }))
        }
      })

      MapEventBus.$on(RELOAD_LAYERS, () => {
        this.clearMap()
        this.$nextTick(this.fillMap)
      })

      MapEventBus.$on(MODE, mode => {
        if (mode !== 'direct_select') {
          this.draw.changeMode(mode)
        }
      })

      MapEventBus.$on(DELETE, () => {
        const { features } = this.draw.getSelected()
        const ids = features.map(({ id }) => id)
        this.$emit('delete', features)
        this.draw.delete(ids)
      })

      MapEventBus.$on(DELETE_LAYER, id => {
        this.removeWmsLayer(id)
      })

      MapEventBus.$on(ZOOM_IN, () => this.map.zoomIn())
      MapEventBus.$on(ZOOM_OUT, () => this.map.zoomOut())

      MapEventBus.$on(SELECT, id => {
        this.selectFeature(id)
      })

      MapEventBus.$on(REPAINT, payload =>
        payload.length
          ? this.repaintFeatures(payload)
          : this.repaintFeature(payload),
      )
    }
  },
  beforeDestroy() {
    MapEventBus.$off()
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
    }),
    selectFeature(id) {
      if (id) {
        const feature = this.draw.get(id)
        if (feature.geometry.type === 'Point') {
          this.draw.changeMode('simple_select', { featureIds: [id] })
          this.$emit('selectionchange', [feature])
        } else {
          this.draw.changeMode('direct_select', { featureId: id })
        }
      }
    },
    clearMap() {
      try {
      this.map.getLayer('-projectArea-line') && this.map.removeLayer('-projectArea-line')
      this.map.getSource('-projectArea-line') && this.map.removeSource('-projectArea-line')
      this.draw.deleteAll()
      this.areas.forEach(area => {
        this.map.getLayer(`${area.properties.name}-${area.id}-line`) && this.map.removeLayer(`${area.properties.name}-${area.id}-line`)
        this.map.getSource(`${area.properties.name}-${area.id}-line`) && this.map.removeSource(`${area.properties.name}-${area.id}-line`)
      })
      } catch (err) {
        console.log(err)
      }
    },
    fillMap() {
      if (this.interactive === false || this.addOnly === true) {
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
      const color =
        id === 'projectArea'
          ? projectAreaStyles[0].paint['fill-color']
          : properties.color

      const lineDetails = geometry.type === 'Polygon' || geometry.type === 'LineString'
        ? {
            id: `${properties.name || ''}-${id}-line`,
            type: 'line',
            paint: {
              'line-color': color || '#088',
              'line-width': id === 'projectArea' ? 5 : 3,
            },
          }
        : {}

      const pointDetails = geometry.type === 'Point'
        ? {
            id: `${properties.name || ''}-${id}-point`,
            type: 'circle',
            paint: {
              'circle-radius': 5,
              'circle-color': color || '#088',
            },
          }
        : {}

      const baseObj = {
        source: {
          type: 'geojson',
          data: {
            type: type,
            geometry: {
              type: geometry.type,
              coordinates: geometry.coordinates,
            },
          },
        },
        layout: {},
      }
      const line = Object.assign({}, baseObj, lineDetails, pointDetails)
      // const fill = Object.assign({}, baseObj, fillDetails)
      // this.map.addLayer(fill)
      const layer = this.map.getLayer(line.id)
      if (!layer) {
        this.map.addLayer(line)
      }
    },
    removeWmsLayer(id) {
      const layer = this.map.getLayer(`wms-layer-${id}`)
      if (layer) {
        this.map.removeLayer(`wms-layer-${id}`)
        this.map.removeSource(`wms-layer-${id}`)
      }
    },
    addWmsLayer({ layerType: type, id, url, tilesize: tileSize, title, visible }) {
      if (!this.map) return

      try {
        this.map.getStyle().layers
      } catch (err) {
        log.warning(
          `Map styles are not loaded yet. Ignore adding layer ${title}`,
          err,
        )
        return
      }

      if (!this.map.getLayer(`wms-layer-${id}-${title}`)) {
        const source = { type, tileSize }
        if (url === 'mapbox://mapbox.satellite') {
          source.url = url
        } else {
          source.tiles = [url]
        }
        try {
          const layers = this.map.getStyle().layers
          const lastWmsLayerIndex = layers
            .filter(layer => /wms-layer-/.test(layer.id))
            .reverse()
            .map(layer => layers.indexOf(layer))
            .reduce((_, item) => item, undefined)

          const lastWmsLayerId = layers[lastWmsLayerIndex]
            ? layers[lastWmsLayerIndex].id
            : undefined
          this.map.addLayer(
            {
              id: `wms-layer-${id}-${title}`,
              type,
              source,
              layout: {
                visibility: visible ? 'visible' : 'none',
              },
            paint: {},
          }, lastWmsLayerId)
        } catch (err) {
          this.showError({
            message: `Could not load WMS Layer: ${title}`,
            duration: 0,
          })
          log.error(`Could not load WMS Layer: ${title}`, err, {
            layer: { type, id, url, tileSize, title, visible },
          })
        }
      }
    },
    repaintFeatures(features) {
      features.forEach(this.repaintFeature)
    },
    repaintFeature(feature) {
      if (this.draw.get(feature.id)) {
        const selectedIds = this.draw.getSelectedIds()

        this.draw
          .delete(feature.id)
          .add(feature)

        if (selectedIds.indexOf(feature.id) !== -1) {
          this.selectFeature(feature.id)
        }
      }
    },
    renderWmsLayersVisibility() {
      Object.keys(this.layerVisibility).forEach(key => {
        this.layerVisibility[key]
          ? this.showWmsLayer(key)
          : this.hideWmsLayer(key)
      })
    },
    renderWmsLayersOpacity() {
      Object.keys(this.layerOpacity).forEach(key => {
        this.wmsLayerOpacity(key, this.layerOpacity[key])
      })
    },
    showWmsLayer(id) {
      if (this.map && this.map.getLayer(`wms-layer-${id}`)) {
        this.map.setLayoutProperty(`wms-layer-${id}`, 'visibility', 'visible')
      }
    },
    hideWmsLayer(id) {
      if (this.map && this.map.getLayer(`wms-layer-${id}`)) {
        this.map.setLayoutProperty(`wms-layer-${id}`, 'visibility', 'none')
      }
    },
    wmsLayerOpacity(id, value) {
      if (this.map && this.map.getLayer(`wms-layer-${id}`)) {
        this.map.setPaintProperty(`wms-layer-${id}`, 'raster-opacity', value)
      }
    },
  },
}
</script>
