<template>
  <div class="layout-default">
    <app-header />

    <div class="layout-default__content">
      <nuxt />

      <md-content class="layout-default__map-wrapper">
        <map-viewer
          :active-base-layer="map.activeBaseLayer"
          :base-layers="map.baseLayers"
          class="layout-default__map"
          @create="createArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @baseLayerSwitch="onBaseLayerSwitch"/>
        <kpi-panel />
      </md-content>
    </div>
    <!-- <section class="layout-default__project">
      <nuxt class="layout-default__page"/>
      <map-viewer
        :active-base-layer="map.activeBaseLayer"
        :base-layers="map.baseLayers"
        class="layout-default__map"
        @create="createArea"
        @update="updateArea"
        @delete="deleteArea"
        @selectionchange="selectionChange"
        @baseLayerSwitch="onBaseLayerSwitch"/>
      <kpi-panel />
    </section> -->

    <md-field>
      <label>Initial Value (Read Only)</label>
      <md-input
        v-model="initial"
        placeholder="Text input"
        data-layout="numeric"
        @focus="show"/>
    </md-field>

    <transition name="slide-up">
      <vue-touch-keyboard
        v-if="visible"
        :layout="layout"
        :cancel="hide"
        :accept="accept"
        :input="input"
        class="custom-keyboard" />
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AppHeader, MapViewer, KpiPanel } from '../components'

export default {
  components: { AppHeader, MapViewer, KpiPanel },
  data() {
    return {
      visible: false,
      layout: {
        _meta: {
          "backspace": { func: "backspace", classes: "control" },
          "accept": { func: "accept", text: "Close", classes: "control featured" },
          "zero": { key: "0", width: 130 },
        },

        default: [
          "1 2 3",
          "4 5 6",
          "7 8 9",
          ". {zero} {backspace} {accept}",
        ],
      },
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false,
      },
    }
  },
  computed: {
    ...mapState({
      map: state => state.project.map,
      area: state => state.project.settings.projectArea.area,
    }),
  },
  methods: {
    ...mapMutations({ onBaseLayerSwitch: 'project/setBaseLayer' }),
    ...mapActions({
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      deleteArea: 'project/deleteArea',
      selectionChange: 'selectedAreas/changeSelection',
    }),

    accept(text) {
      console.log(text)
      this.hide();
    },
    show(e) {
      console.log(e)
      this.input = e.target;

      if (!this.visible)
        this.visible = true
    },
    hide() {
      this.visible = false;
    },
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout-default {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.layout-default__content {
  display: flex;
  flex: 1;
}

.layout-default__map-wrapper {
  flex: 1;
  display: flex;
}

.layout-default__map {
  flex: 1;
}

.vue-touch-keyboard.custom-keyboard {
  width: 450px;
  padding: 1rem;
  background-color: #fafafa;
}

.custom-keyboard {
  position: absolute;
  bottom: 0;
  left: calc(50% - 225px);
  z-index: var(--layer--popup);
}
</style>
