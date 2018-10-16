<template>
  <div class="layout-modal">
    <app-header :title="title" @onShowNavigation="showMenu"/>
    <app-menu
      :show-navigation="showNavigation"
      :title="$t('ast')"
      :accepted-legal="acceptedLegal"
      :created-project-area="createdProjectArea"
      :filled-in-required-settings="filledInRequiredProjectAreaSettings"
      @onCloseNavigation="hideMenu"
      @saveProject="saveProject"
      @importProject="onFileInput"
      @newProject="onNewProject"/>

    <div class="layout-modal__content">
      <div class="layout-modal__page-wrapper">
        <md-content class="md-elevation-6">
          <nuxt class="layout-modal__page"/>
        </md-content>
      </div>

      <map-viewer
        :active-base-layer="map.activeBaseLayer"
        :base-layers="map.baseLayers"
        :project-area="projectArea"
        :is-project="true"
        :areas="areas"
        :interactive="false"
        :map-center="center"
        :map-zoom="zoom"
        :current-mode="mapMode"
        class="layout-modal__map"
        @move="setMapPosition"/>
    </div>

    <transition name="slide-up">
      <app-disclaimer
        v-if="!legalAccepted"
        :disclaimer="disclaimer"
        class="layout-modal__disclaimer"
        @accepted="acceptLegal"/>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { AppDisclaimer, AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu } from '../components'
import getData from '~/lib/get-data'

export default {
  components: { AppDisclaimer, AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu },
  data() {
    return {
      disclaimer: {},
    }
  },
  computed: {
    ...mapState({
      map: state => state.project.map,
      areas: state => state.project.areas,
      projectArea: state => state.project.settings.area,
      legalAccepted: state => state.project.legalAccepted,
      center: state => state.project.map.center,
      zoom: state => state.project.map.zoom,
      showNavigation: state => state.appMenu.show,
      title: state => state.project.settings.general.title,
      mapMode: state => state.map.mode,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups']),
    ...mapGetters('flow', ['acceptedLegal', 'createdProjectArea', 'filledInRequiredProjectAreaSettings', 'currentFilledInLevel']),
  },
  async beforeMount() {
    const locale = this.$i18n.locale
    const data =  await getData({ locale, slug: 'legal' })
    this.disclaimer = { ...data.legal.disclaimer }
  },
  methods: {
    ...mapMutations({
      acceptLegal: 'project/acceptLegal',
      showMenu: 'appMenu/showMenu',
      hideMenu: 'appMenu/hideMenu',
    }),
    ...mapActions({
      importProject: 'project/importProject',
      saveProject: 'project/saveProject',
      setMapPosition: 'project/setMapPosition',
      clearState: 'project/clearState',
    }),
    async onFileInput(event) {
      this.importProject(event)
        .then(() => this.$router.push(this.currentFilledInLevel.uri))
    },
    onNewProject() {
      if (this.projectArea.id) {
        const result = window.confirm(this.$i18n.t('confirm_new_project'))

        if (result) {
          this.clearState()
        } else {
          this.hideMenu()
          return
        }
      }

      this.hideMenu()
      this.$router.push(`/${this.$i18n.locale}/new-project`)
    },
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
