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
      <label>Initial Value</label>
      <md-input
        ref="myInput"
        v-model="myInput"
        placeholder="Text input"
        @focus="(e) => { return onFocus(e)}"
      />
    </md-field>

    <transition name="slide-up">
      <vue-touch-keyboard
        v-if="visible"
        :cancel="hide"
        :accept="accept"
        :input="input"
        :layout="numericLayout"
        class="custom-keyboard" />
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, KpiPanel } from '../components'
import { numericLayout, options } from '~/assets/custom-keyboard-options'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, KpiPanel },
  data() {
    return {
      visible: false,
      input: null,
      numericLayout,
      options,
      myInput: '',
    }
  },
  computed: {
    ...mapState({
      map: state => state.project.map,
      area: state => state.project.settings.projectArea.area,
      focusedInput: state => state.focusedInput.inputElement,
    }),
  },
  methods: {
    ...mapMutations({
      onBaseLayerSwitch: 'project/setBaseLayer',
      updateFocusedInput: 'focusedInput/updateFocusedInput',
      removeFocusedInput: 'focusedInput/removeFocusedInput',
      updateInputValue: 'focusedInput/updateInputValue',
    }),
    ...mapActions({
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      deleteArea: 'project/deleteArea',
      selectionChange: 'selectedAreas/changeSelection',
    }),

    onFocus({ target }) {
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
