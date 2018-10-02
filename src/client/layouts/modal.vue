<template>
  <div class="layout-modal">
    <app-header />

    <div class="layout-modal__content">
      <div class="layout-modal__page-wrapper">
        <md-content class="md-elevation-6">
          <nuxt class="layout-modal__page"/>
        </md-content>
      </div>

      <map-viewer
        :active-base-layer="map.activeBaseLayer"
        :base-layers="map.baseLayers"
        :interactive="false"
        class="layout-modal__map"/>
    </div>

    <transition name="slide-up">
      <app-disclaimer
        v-if="!legalAccepted"
        class="layout-modal__disclaimer"
        @accepted="acceptLegal"/>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import { AppDisclaimer, AppHeader, MapViewer, KpiPanel, VirtualKeyboard } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppDisclaimer, AppHeader, MapViewer, KpiPanel, VirtualKeyboard },
  computed: {
    ...mapState({
      map: state => state.project.map,
      area: state => state.project.settings.projectArea.area,
      legalAccepted: state => state.project.legalAccepted,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups']),
  },
  methods: {
    ...mapMutations({
      acceptLegal: 'project/acceptLegal',
    }),
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout-modal {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.layout-modal__content {
  overflow-y: scroll;
  display: flex;
  flex: 1;
  z-index: 0;
}

.layout-modal__map {
  flex: 1;
  z-index: 0;
}

.layout-modal__page-wrapper {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-modal__page {
  padding: var(--spacing-default);
}

.layout-modal__disclaimer {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>
