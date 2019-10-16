<template>
  <div ref="base" class="layout">
    <app-header
      :title="title"
      :legal-accepted="legalAccepted"
      :project-title="projectTitle"
      @onShowNavigation="showMenu"/>
    <app-menu
      :show-navigation="showNavigation"
      :title="title"
      :accepted-legal="acceptedLegal"
      :created-project-area="createdProjectArea"
      :filled-in-required-settings="filledInRequiredProjectAreaSettings"
      :has-areas="!!areas.length"
      @onCloseNavigation="hideMenu"
      @saveProject="saveProject"
      @importProject="onFileInput"
      @newProject="onNewProject"
      @exportProject="() => {showExport(); hideMenu();}"/>

    <div class="layout__content">
      <div v-if="mode === 'modal'" class="layout__page-wrapper">
        <md-content class="md-elevation-6">
          <nuxt class="layout__page"/>
        </md-content>
      </div>
      <nuxt v-else />
      <md-content class="layout__map-wrapper">
        <map-viewer
          :project-area="projectArea"
          :is-project="isProject"
          :areas="areas"
          :point="point"
          :line="line"
          :polygon="polygon"
          :search="search"
          :add-only="addOnly"
          :interactive="interactive"
          :map-center="center"
          :map-zoom="zoom"
          :current-mode="mapMode"
          :wms-layers="wmsLayers"
          :custom-layers="customLayers"
          :map-layers="mapLayers"
          :mode="mode"
          class="layout__map"
          @create="onCreateArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @move="setMapPosition"/>
        <kpi-panel
          v-if="filledInSettings"
          :kpis="filteredKpiGroups"
          :kpi-values="filteredKpiValues"
          :kpi-percentage-values="filteredKpiPercentageValues"
          :selected-areas="selectedAreas && selectedAreas[0]"/>
      </md-content>
    </div>

    <virtual-keyboard class="layout__virtual-keyboard"/>

    <md-dialog :md-active="exportShown">
      <md-dialog-title>{{ $t('export_project') }}</md-dialog-title>

      <md-dialog-content>
        <p class="md-body">{{ $t('export_description') }}</p>
        <md-field>
          <label for="movie">{{ $t('format') }}</label>
          <md-select @input="value => { hideExport(); exportProject(value) }">
            <md-option value="csv">{{ $t('csv') }}</md-option>
            <md-option value="geojson">{{ $t('geojson') }}</md-option>
          </md-select>
        </md-field>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="hideExport">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <transition name="slide-up">
      <app-disclaimer
        v-if="!legalAccepted"
        :disclaimer="disclaimer"
        class="layout__disclaimer"
        @accepted="acceptLegal"/>
    </transition>

    <notification-area
      :notifications="notifications"
      @remove-notification="removeNotification"
    />

    <!-- portal for general popup -->
    <portal-target name="popup-portal" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { addDeviceClasses, isMobile, getUserAgent } from '../lib/device-detection'
import { AppDisclaimer, AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu, NotificationArea } from '../components'
import { mapFields } from 'vuex-map-fields';
import getData from '~/lib/get-data'
import EventBus, { CLICK } from "~/lib/event-bus";
import { debounce } from 'lodash';

export default {
  components: { AppDisclaimer, AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu, NotificationArea },
  data() {
    return {
      disclaimer: {},
    }
  },
  head() {
    return {
      meta: [
        { hid: 'description', name: 'description', content: this.$i18n.t('app_description') },
      ],
      title: this.title,
    }
  },

  computed: {
    ...mapState({
      devMode: state => state.devMode,
      map: state => state.project.map,
      projectArea: state => state.project.settings.area,
      legalAccepted: state => state.project.legalAccepted,
      center: state => state.project.map.center,
      zoom: state => state.project.map.zoom,
      showNavigation: state => state.appMenu.show,
      projectTitle: state => state.project.settings.general.title,
      mapMode: state => state.map.mode,
      notifications: state => state.notifications.messages,
      mode: state => state.mode.state,
      exportShown: state => state.flow.export,
      inSetMeasureFlow: state => state.setMeasureFlow.inFlow,
      userIsRefreshing: state => state.user.isRefreshing,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups', 'areas', 'wmsLayers', 'customLayers', 'mapLayers']),
    ...mapGetters('flow', ['acceptedLegal', 'createdProjectArea', 'filledInRequiredProjectAreaSettings', 'currentFilledInLevel', 'filledInSettings']),
    ...mapGetters({ selectedAreas:  'selectedAreas/features' }),
    ...mapGetters('map', ['isProject', 'point', 'line', 'polygon', 'addOnly', 'interactive', 'search']),
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('data/appConfig', ['title']),
  },

  watch: {
    userIsRefreshing() {
      window.removeEventListener('beforeunload', this.beforeUnload)
    },
  },
  async beforeMount() {
    const locale = this.$i18n.locale
    const data =  await getData({ locale, slug: 'legal' })
    this.disclaimer = { ...data.legal.disclaimer }

    addDeviceClasses(document.documentElement)

    this.setViewportHeightProperty()
    window.addEventListener('resize', this.resizeHandler)
  },

  // beforeMount() {
  // },

  mounted() {
    this.$refs.base.addEventListener('click', this.dispatchClickEvent)

    if (this.devMode === false) {
      window.addEventListener('beforeunload', this.beforeUnload)
    }
  },

  beforeDestroy() {
    this.$refs.base.removeEventListener('click', this.dispatchClickEvent)
    window.removeEventListener('beforeunload', this.beforeUnload)
    window.removeEventListener('resize', this.resizeHandler)
  },

  methods: {
    ...mapMutations({
      acceptLegal: 'project/acceptLegal',
      showMenu: 'appMenu/showMenu',
      hideMenu: 'appMenu/hideMenu',
      showExport: 'flow/showExport',
      hideExport: 'flow/hideExport',
      removeNotification: 'notifications/remove',
    }),
    ...mapActions({
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      deleteArea: 'project/deleteArea',
      selectionChange: 'selectedAreas/changeSelection',
      importProject: 'project/importProject',
      saveProject: 'project/saveProject',
      setMapPosition: 'project/setMapPosition',
      showError: 'notifications/showError',
      clearState: 'project/clearState',
      exportProject: 'project/exportProject',
      connectMeasureToArea: 'setMeasureFlow/connectMeasureToArea',
    }),
    async onFileInput(event) {
      this.importProject(event)
        .then(() => this.$router.push(this.currentFilledInLevel.uri))
        .catch(error => this.showError({ message: this.$i18n.t('could_not_load_file') }))
    },
    onNewProject() {
      if (this.projectArea.id || this.areas.length) {
        const result = window.confirm(this.$i18n.t('confirm_new_project'))

        if (result) {
          this.clearState()
        } else {
          this.hideMenu()
          return
        }
      }

      this.hideMenu()
      this.$router.push(`/${this.$i18n.locale}/new-project`).catch(err => {})
    },
    onCreateArea(features) {
      this.createArea(features)
        .then(() => {
          if (this.inSetMeasureFlow) {
            this.connectMeasureToArea(features)
          }
        })
    },
    dispatchClickEvent(event) {
      EventBus.$emit(CLICK, event)
    },
    beforeUnload(e) {
      const message = "You may have unsaved changes"
      e.returnValue = message
      return message
    },
    resizeHandler() {
      debounce(this.setViewportHeightProperty.bind(this), 100)()
    },
    setViewportHeightProperty() {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
    },
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: var(--vh, 100vh);
  overflow: hidden;
  position: relative;
}

.layout__content {
  overflow-y: scroll;
  display: flex;
  flex: 1;
  z-index: 0;
}

.layout__map-wrapper {
  flex: 1;
  display: flex;
  z-index: 0;
}

.layout__map {
  flex: 1;
}

.layout__page-wrapper {
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

.layout__page {
  padding: var(--spacing-default);
}

.layout__virtual-keyboard {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}

.layout__disclaimer {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>
