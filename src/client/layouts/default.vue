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

    <md-field>
      <label>Initial Value (Read Only)</label>
      <md-input
        placeholder="Text input"
        data-layout="numeric"
        @focus="show"/>
    </md-field>

    <transition name="slide-up">
      <vue-touch-keyboard
        v-if="visible"
        :layout="numericLayout"
        :cancel="hide"
        :accept="accept"
        :input="input"
        class="custom-keyboard" />

        <!-- <touch-keyboard
        v-if="visible"
        :input="input"
        @cancel="hide"
        @accept="accept" /> -->

    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AppHeader, MapViewer, KpiPanel, TouchKeyboard } from '../components'
import { numericLayout } from '~/assets/custom-keyboard-layout'

export default {
  components: { AppHeader, MapViewer, KpiPanel, TouchKeyboard },
  data() {
    return {
      visible: false,
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false,
      },
      numericLayout,
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
  padding: var(--spacing-default);
  background-color: var(--neutral-color--light);
  box-shadow: var(--shadow-wide-grey);
}

.custom-keyboard {
  position: absolute;
  bottom: 0;
  left: calc(50% - 225px);
  font-family: 'Roboto';
  z-index: var(--layer--popup);
}

.custom-keyboard .key {
  border-color: #ddd;
}
</style>
