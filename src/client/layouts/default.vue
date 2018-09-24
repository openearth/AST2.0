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

    <numeric-input
      :label="'My first input'"
      :value="projectAreaSettings.slope"
      :on-change="value => setProjectAreaSetting({
        key: 'slope',
        value: value,
      })"
    />
    <numeric-input
      :label="'My second input'"
      :value="projectAreaSettings.soil"
      :force-keyboard="true"
      :on-change="value => setProjectAreaSetting({
        key: 'soil',
        value: value,
      })"
    />

    <virtual-keyboard class="layout-default__virtual-keyboard"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, KpiPanel, NumericInput, VirtualKeyboard } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, KpiPanel, NumericInput, VirtualKeyboard },
  data() {
    return {
      visible: false,
      input: null,
    }
  },
  computed: {
    ...mapState({
      map: state => state.project.map,
      area: state => state.project.settings.projectArea.area,
      projectAreaSettings: state => state.project.settings.projectArea,
      focusedInput: state => state.focusedInput.inputElement,
    }),
  },
  methods: {
    ...mapMutations({
      onBaseLayerSwitch: 'project/setBaseLayer',
      setProjectAreaSetting: 'project/setProjectAreaSetting',
    }),
    ...mapActions({
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      deleteArea: 'project/deleteArea',
      selectionChange: 'selectedAreas/changeSelection',
    }),

    onFocus(target) {
      const inputToString = target.toString()

      this.updateFocusedInput(inputToString)
      this.show(target)
    },
    accept(text) {
      this.updateInputValue(text)
      this.removeFocusedInput()

      this.hide()
    },
    show(target) {
      this.input = target

      if (!this.visible) {
        this.visible = true
      }
    },
    hide() {
      this.visible = false
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
  position: relative;
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

.layout-default__virtual-keyboard {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
</style>
