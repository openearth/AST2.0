<template>
  <article class="pdf-export-map">
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
  </article>
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
      if (this.isReady === false) {
        return
      }
      setTimeout(() => {
        this.imageSrc = document.querySelector('.mapboxgl-canvas').toDataURL()
        this.$nextTick(() => {
          document.dispatchEvent(new CustomEvent('mapbox-image-created'))
        })
      }, 2500)
    },
  },
}
</script>

<style>
.pdf-export-map {
  width: 64vh;
  height: 50vw !important;
}

.pdf-export-map__map {
  z-index: 100;
  width: 297cm;
  height: 210cm;
  position: absolute;
  top: 0;
  left: 0;
}

.pdf-export-map__image {
  width: 64vh;
  height: 50vw !important;
  object-fit: cover;
}
</style>