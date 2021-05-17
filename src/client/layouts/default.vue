
<template>
  <div
    ref="base"
    class="layout"
    :style="workspaceColors"
  >
    <app-header
      :title="title"
      :legal-accepted="legalAccepted"
      :project-title="projectTitle"
      @on-show-navigation="showMenu"
    />
    <app-menu
      :show-navigation="showNavigation"
      :title="title"
      :accepted-legal="acceptedLegal"
      :created-project-area="createdProjectArea"
      :filled-in-required-settings="filledInRequiredProjectAreaSettings"
      :has-areas="!!areas.length"
      @on-close-navigation="hideMenu"
      @save-project="saveProject"
      @import-project="onFileInput"
      @new-project="onNewProject"
      @export-project="() => {showExport(); hideMenu();}"
    />

    <div class="layout__content">
      <div v-if="mode === 'modal'" class="layout__page-wrapper">
        <md-content class="md-elevation-6">
          <nuxt class="layout__page" />
        </md-content>
      </div>
      <nuxt v-else />
      <md-content class="layout__map-wrapper">
        <map-viewer
          v-if="displayMap"
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
          :custom-layers="customLayers"
          :layer-list="layerList"
          :heatstress-layers="heatstressLayers"
          :mode="mode"
          :animate="true"
          class="layout__map"
          @create="onCreateArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @move="setMapPosition"
        />
        <app-results-panel
          v-if="filledInSettings"
          :buttons="sidePanelTabButtons"
          default-active="numbers"
        >
          <template slot-scope="scope">
            <kpi-panel
              v-if="scope.active === 'bars' || scope.active === 'numbers'"
              :display-type="scope.active"
              :kpis="filteredKpiGroups"
              :kpi-values="filteredKpiValues"
              :kpi-percentage-values="filteredKpiPercentageValues"
              :selected-areas="selectedAreas && selectedAreas[0]"
            />
            <app-results-rivm
              v-if="scope.active === 'rivm'"
              :data="rivmCoBenefits"
              :dato-content="kbsResultContent"
              :translations="kbsRivmContent"
              @fetch-data="fetchRivmCoBenefits"
            />
            <app-results-heatstress
              v-if="scope.active === 'heatstress'"
              :heatstress-results="heatstressResults"
              :heatstress-layers="heatstressLayers"
              :areas="areas"
              :dato-content="kbsResultContent"
              @fetch-data="fetchHeatstressData"
            />
          </template>
        </app-results-panel>
      </md-content>
    </div>

    <virtual-keyboard class="layout__virtual-keyboard" />

    <md-dialog :md-active="exportShown">
      <md-dialog-title>{{ $t('export_project') }}</md-dialog-title>

      <md-dialog-content>
        <p class="md-body">
          {{ $t('export_description') }}
        </p>
        <md-field>
          <label for="movie">{{ $t('format') }}</label>
          <md-select @input="value => { hideExport(); exportProject(value) }">
            <md-option value="csv">
              {{ $t('csv') }}
            </md-option>
            <md-option value="geojson">
              {{ $t('geojson') }}
            </md-option>
            <md-option value="pdf">
              {{ $t('pdf') }}
            </md-option>
          </md-select>
        </md-field>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-accent" @click="hideExport">
          Close
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active="pdfExportShown">
      <md-dialog-title>{{ $t('pdf_export') }}</md-dialog-title>
      <md-dialog-content>
        {{ $t('pdf_is_exporting') }}
        <md-progress-bar
          :md-value="pdfProgress"
          md-mode="determinate"
        />
      </md-dialog-content>
    </md-dialog>

    <transition name="slide-up">
      <app-disclaimer
        v-if="!legalAccepted"
        :disclaimer="disclaimer"
        class="layout__disclaimer"
        @accepted="acceptLegal"
      />
    </transition>

    <notification-area
      :notifications="notifications"
      @remove-notification="removeNotification"
    />

    <!-- portal for general popup -->
    <portal-target name="popup-portal" />

    <project-area-size-threshold :is-below-threshold="projectAreaSizeIsBelowThreshold" />

    <scenario-overview
      v-if="scenariosShown"
      :value="projectAreaSettings['scenarioName']"
      :scenarios="scenariosInActiveWorkspace"
      @choose-scenario="value => updateProjectAreaSetting({ type: 'select', key: 'scenarioName', value })"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import AppDisclaimer from '../components/app-disclaimer'
import AppHeader from '../components/app-header'
import MapViewer from '../components/map-viewer'
import KpiPanel from '../components/kpi-panel'
import VirtualKeyboard from '../components/virtual-keyboard'
import AppMenu from '../components/app-menu'
import NotificationArea from '../components/notification-area'
import AppResultsPanel from '../components/app-results-panel'
import AppResultsRivm from '../components/app-results-rivm'
import AppResultsHeatstress from '../components/app-results-heatstress'
import ProjectAreaSizeThreshold from '../components/project-area-size-threshold'
import ScenarioOverview from '@/components/scenario-overview'
import getData from '~/lib/get-data'
import EventBus, { CLICK } from '~/lib/event-bus'
import log from '~/lib/log'

export default {
  components: { AppDisclaimer, AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu, NotificationArea, ProjectAreaSizeThreshold, AppResultsPanel, AppResultsRivm, AppResultsHeatstress, ScenarioOverview },
  data() {
    return {
      disclaimer: {},
      pdfProgress: undefined,
      kbsResultContent: {},
      kbsRivmContent: [],
    }
  },

  computed: {
    ...mapState({
      devMode: state => state.devMode,
      displayMap: state => state.project.displayMap,
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
      pdfExportShown: state => state.flow.pdfExport,
      scenariosShown: state => state.flow.scenarios,
      inSetMeasureFlow: state => state.setMeasureFlow.inFlow,
      userIsRefreshing: state => state.user.isRefreshing,
      rivmCoBenefits: state => state.project.rivmCoBenefits,
      heatstressResults: state => state.project.heatstressResults,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups', 'areas', 'customLayers','layers', 'heatstressLayers']),
    ...mapGetters('flow', ['acceptedLegal', 'createdProjectArea', 'filledInRequiredProjectAreaSettings', 'currentFilledInLevel', 'filledInSettings', 'projectAreaSizeIsBelowThreshold']),
    ...mapGetters({
      selectedAreas:  'selectedAreas/features',
      projectAreaSettings: 'project/settingsProjectArea',
      scenariosInActiveWorkspace: 'data/workspaces/scenariosInActiveWorkspace',
    }),
    ...mapGetters('map', ['isProject', 'point', 'line', 'polygon', 'addOnly', 'interactive', 'search']),
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('data/appConfig', ['title']),
    ...mapGetters('data/workspaces', ['activeWorkspace']),
    layerList() {
      return [...this.customLayers, ...this.layers]
    },
    sidePanelTabButtons() {
      return [
        { id: 'numbers', icon: 'format_list_numbered' },
        { id: 'bars', icon: 'insert_chart' },
        ( this.activeWorkspace.showRivmCoBenefits && { id: 'rivm', icon: 'eco', color: '--nature-green-color' } ),
        ( this.activeWorkspace.showHeatstress && { id: 'heatstress', icon: 'wb_sunny', color: '--yellow-color' } ),
      ]
    },
    workspaceColors() {
      try {
      return`
        --primary-color: ${this.activeWorkspace.primaryColor.hex};
        --accent-color: ${this.activeWorkspace.accentColor.hex};
        --md-theme-default-primary: var(--primary-color);
        --md-theme-default-accent: var(--accent-color);
      `
      } catch (error) {
        return ''
      }
    },
  },

  watch: {
    userIsRefreshing() {
      window.removeEventListener('beforeunload', this.beforeUnload)
    },
    pdfExportShown(isShown) {
      if (isShown === false) {
        this.pdfProgress = undefined
      }
    },
  },
  async beforeMount() {
    const locale = this.$i18n.locale
    const [ { kbsResult }, { kbsRivm }, { legal } ] = await Promise.all([
      getData({ locale, slug: 'kbs-results' }),
      getData({ locale, slug: 'kbs-rivm' }),
      getData({ locale, slug: 'legal' }),
    ])

    this.kbsResultContent = { ...kbsResult }
    this.kbsRivmContent = kbsRivm
    this.disclaimer = { ...legal.disclaimer }
  },

  mounted() {
    this.$refs.base.addEventListener('click', this.dispatchClickEvent)

    if (this.devMode === false) {
      window.addEventListener('beforeunload', this.beforeUnload)
    }

    document.addEventListener('pdf-export-progress', event => {
      this.pdfProgress = event.detail.percentage
    })

    window.addEventListener('keydown', event => {
      if (event.key === 'o' && event.metaKey) {
        event.preventDefault()
        document.querySelector('#open-project').click()
      }

      if (event.key === 'e' && event.metaKey) {
        event.preventDefault()
        document.querySelector('#export-project').click()
      }
    })
  },

  beforeDestroy() {
    this.$refs.base.removeEventListener('click', this.dispatchClickEvent)
    window.removeEventListener('beforeunload', this.beforeUnload)
  },

  methods: {
    ...mapMutations({
      acceptLegal: 'project/acceptLegal',
      showMenu: 'appMenu/showMenu',
      hideMenu: 'appMenu/hideMenu',
      showExport: 'flow/showExport',
      hideExport: 'flow/hideExport',
      showPdfExport: 'flow/showPdfExport',
      hidePdfExport: 'flow/hidePdfExport',
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
      fetchRivmCoBenefits: 'project/fetchRivmCoBenefits',
      fetchHeatstressData: 'project/fetchHeatstressData',
      updateProjectAreaSetting: 'project/updateProjectAreaSetting',
    }),
    async onFileInput(event) {
      this.importProject(event)
        .then(() =>
          this.$router.push(this.currentFilledInLevel.uri)
            .catch(error => {
              if (/Avoided redundant navigation/.test(error.message)) {
                return
              }
              throw new Error(error)
            }),
        )
        .catch(error => {
          if (error.name !== 'NavigationDuplicated') {
            log.error('Could not load file', error)
            this.showError({ message: this.$i18n.t('could_not_load_file') })
          }
        })
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
      this.$router.push(`/${this.$i18n.locale}/new-project`).catch(() => {})
    },
    onCreateArea(features) {
      this.createArea(features).then(() => {
        if (this.inSetMeasureFlow) {
          this.connectMeasureToArea(features)
        }
      })
    },
    dispatchClickEvent(event) {
      EventBus.$emit(CLICK, event)
    },
    beforeUnload(e) {
      const message = 'You may have unsaved changes'
      e.returnValue = message
      return message
    },
  },

  head() {
    return {
      meta: [
        { hid: 'description', name: 'description', content: this.$i18n.t('app_description') },
      ],
      title: this.title,
    }
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
