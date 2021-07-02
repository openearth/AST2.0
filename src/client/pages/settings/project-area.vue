<template>
  <div class="project-area">
    <md-toolbar
      md-elevation="0"
      class="md-transparent project-area__area-size"
    >
      <span class="md-subheading">{{ $t('area_size') }}: <strong><unit-output :value="area" unit="surface" /></strong></span>
      <md-button
        :to="`/${locale}/new-project`"
        class="md-accent"
        :disabled="fetchingApiData"
      >
        {{ $t('change_area') }}
      </md-button>
    </md-toolbar>

    <form class="project-area__form">
      <section
        v-for="setting in areaSettings"
        :key="setting.key"
        class="project-area__group"
      >
        <span class="md-list-item-text">{{ setting.title }}</span>

        <md-list
          v-if="!setting.isSelect"
          class="project-area__options"
        >
          <md-list-item
            v-for="option in setting.options"
            :key="option.value"
          >
            <md-checkbox
              v-if="setting.multiple && !setting.isSelect"
              :value="!projectAreaSettings[setting.key][option.value]"
              :disabled="loadingDefaultValueAreaSettings.includes(setting.key) || fetchingApiData"
              @change="value => updateProjectAreaSetting({
                type: 'checkbox',
                key: setting.key,
                option: option.value,
                value
              })"
            />
            <md-radio
              v-else
              :value="projectAreaSettings[setting.key] !== option.value"
              :disabled="loadingDefaultValueAreaSettings.includes(setting.key) || fetchingApiData"
              required
              @change="value => updateProjectAreaSetting({
                type: 'radio',
                key: setting.key,
                value: option.value,
              })"
            />
            <span class="md-list-item-text">{{ option.title }}</span>
          </md-list-item>
          <md-button
            v-if="setting.infoText"
            class="md-icon-button info-button"
            @click="setActiveTooltip(setting.key)"
          >
            <md-icon>info</md-icon>
            <md-tooltip :md-active="activeTooltipKey === setting.key" md-direction="top">
              {{ setting.infoText }}
            </md-tooltip>
          </md-button>
        </md-list>

        <md-list
          v-else
          class="project-area__select"
        >
          <div style="max-width: 90%; flex-grow: 1;">
            <md-list-item>
              <select-input
                :id="setting.key"
                :options="setting.options"
                :value="projectAreaSettings[setting.key]"
                :disabled="loadingDefaultValueAreaSettings.includes(setting.key) || fetchingApiData"
                @change="value => updateProjectAreaSetting({
                  type: 'select',
                  key: setting.key,
                  value,
                })"
              />
            </md-list-item>
          </div>
          <md-button
            v-if="setting.infoText"
            class="md-icon-button"
            @click="setActiveTooltip(setting.key)"
          >
            <md-icon>info</md-icon>
            <md-tooltip :md-active="activeTooltipKey === setting.key" md-direction="top">
              {{ setting.infoText }}
            </md-tooltip>
          </md-button>

          <aside
            v-if="setting.key === 'scenarioName'"
            class="project-area__scenario-overview scenario-overview"
          >
            <md-button v-if="activeWorkspace.showScenarioExamplesInSettings" @click="showScenarios">
              {{ $t('scenario_examples') }}
            </md-button>
          </aside>
        </md-list>
      </section>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { SelectInput } from '~/components'
import UnitOutput from '~/components/unit-output'
import log from '~/lib/log'

export default {
  middleware: ['access-level-project-area'],
  components: { SelectInput, UnitOutput },
  data() {
    return {
      activeTooltipKey: '',
    }
  },
  computed: {
    ...mapState({
      locale: state => state.i18n.locale,
      projectArea: state => state.project.settings.area,
      userViewedProjectSettings: state => state.project.settings.userViewedProjectSettings,
      loadingDefaultValueAreaSettings: state => state['loading-default-value-area-settings'],
      fetchingApiData: state => state.flow.fetchingApiData,
    }),
    ...mapGetters({
      projectAreaSettings: 'project/settingsProjectArea',
      areaSettings: 'data/areaSettings/overriddenAreaSettings',
      scenariosInActiveWorkspace: 'data/workspaces/scenariosInActiveWorkspace',
      activeWorkspace: 'data/workspaces/activeWorkspace',
    }),
    area() { return this.projectArea.properties && Math.round(this.projectArea.properties.area) },
  },
  mounted() {
    if (this.userViewedProjectSettings === false) {
      log.info('User did not see settings before. Start filling with smart defaults')
      this.setSmartDefaultsForProjectSettings()
    }
  },
  methods: {
    ...mapMutations({
      showScenarios: 'flow/showScenarios',
    }),
    ...mapActions({
      updateProjectAreaSetting: 'project/updateProjectAreaSetting',
      setSmartDefaultsForProjectSettings: 'project/setSmartDefaultsForProjectSettings',
    }),
    setActiveTooltip(key) {
      if (this.activeTooltipKey === key) {
        return this.activeTooltipKey = ''
      }

      this.activeTooltipKey = key
    },
  },
}
</script>

<style>
.project-area__area-size {
  background-color: #eee !important;
  padding: var(--spacing-default);
  display: flex;
  justify-content: space-between;
}

.project-area__form {
  margin: var(--spacing-default);
  margin-top: var(--spacing-large);
}

.project-area__group {
  margin-top: var(--spacing-medium);
}

.project-area__group > .md-list-item-text {
  padding-right: calc( var(--spacing-default) * 2 ); /* space for info button */
  padding-left: var(--spacing-default);
}

.project-area__select {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-right: 2px;
}

.project-area__options {
  position: relative;
}

.info-button {
  position: absolute;
  top: -32px;
  right: 2px;
}

.project-area__scenario-overview {
  flex-basis: 100%;
  transform: translateY(calc(var(--spacing-half) * -1));
  display: flex;
  justify-content: flex-end;
}
</style>
