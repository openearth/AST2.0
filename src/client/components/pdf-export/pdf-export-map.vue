<template>
  <div class="pdf-export-map">
    <map-viewer
      v-if="imageSrc === undefined"
      :project-area="projectArea"
      :is-project="isProject"
      :areas="areas"
      :map-center="center"
      :map-zoom="zoom"
      :interactive="false"
      :fit-to-bounds="bbox"
      :animate="false"
      class="pdf-export-map"
      @render="onMapRender"
    />
    <img
      :src="imageSrc"
      class="pdf-export-map__image"
    >
  </div>
</template>

<script>
import get from 'lodash/get'
import turfBBox from '@turf/bbox'
import { mapState, mapGetters } from 'vuex'
import MapViewer from '../map-viewer'

export default {
  components: { MapViewer },
  data() {
    return {
      imageSrc: undefined,
      bbox: undefined,
      mapboxHasLoaded: false,
    }
  },
  computed: {
    ...mapState({
      projectArea: state => state.project.settings.area,
      center: state => state.project.map.center,
      zoom: state => state.project.map.zoom,
    }),
    ...mapGetters('project', ['areas']),
    ...mapGetters('map', ['isProject']),
    projectAreaHasLoaded() {
      return Boolean(get(this, 'projectArea.geometry'))
    },
    isReady() {
      return this.projectAreaHasLoaded && this.mapboxHasLoaded
    },
  },
  watch: {
    isReady(ready) {
      if (ready && get(this, 'projectArea.geometry')) {
        this.$nextTick(() => {
          this.bbox = turfBBox(this.projectArea.geometry)
        })
      }
    },
  },
  mounted() {
    document.addEventListener('mapbox-loaded', this.onMapBoxLoaded)
  },
  destroyed() {
    document.removeEventListener('mapbox-loaded', this.onMapBoxLoaded)
  },
  methods: {
    onMapBoxLoaded() {
      this.mapboxHasLoaded = true
    },
    onMapRender() {
      this.$nextTick(() => {
        this.imageSrc = document.querySelector('.mapboxgl-canvas').toDataURL()
        this.$nextTick(() => {
          document.dispatchEvent(new CustomEvent('mapbox-image-created'))
        })
      })
    },
  },
}
</script>

<style>
.pdf-export-map {
  page-break-before: always;
  width: 287mm; /* A4 paper size minus 0.5cm margin */
  height: 190mm; /* A4 paper size minus 0.5cm margin */
}

.pdf-export-map__map {
  z-index: 100;
  width: calc(100vw - 1cm);
  height: calc(100vh - 1cm);
  position: absolute;
  top: 0;
  left: 0;
}

.pdf-export-map__image {
  width: calc(100% - 1cm);
  height: calc(100% - 1cm);
}
</style>
