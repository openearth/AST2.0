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
    <ul class="pdf-export-map__measure-list">
      <li
        v-for="{ measure } in measureCollection"
        :key="measure.measureId"
        :style="`border-color: ${measure.color.hex}`"
        class="pdf-export-map__measure-item"
      >
        <img
          :src="`${measure.image.url}?w=75&h=75`"
          width="50px"
          height="50px"
          alt=""
        >
        <p>
          {{ measure.title }}
        </p>
      </li>
    </ul>
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
    ...mapGetters('project', ['areas', 'measureCollection']),
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
}

.pdf-export-map__map {
  z-index: 100;
  width: 297cm;
  height: 210cm;
  position: absolute;
  top: 0;
  left: 0;
}

.pdf-export-map .map-viewer__map {
  width: 64vh !important;
  height: 50vw !important;
}

.pdf-export-map__image {
  width: 64vh;
  height: 50vw !important;
  object-fit: cover;
}

.pdf-export-map__measure-list {
  display: grid;
  grid-template-columns: repeat( auto-fill, minmax(50px, 18vw) );
  gap: 0.5cm;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 0.5cm;
}

.pdf-export-map__measure-item {
  border-left: 5px solid;
  padding-left: 0.25cm;
}
</style>
