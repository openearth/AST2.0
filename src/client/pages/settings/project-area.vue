<template>
  <div class="project-area">
    <md-toolbar
      md-elevation="0"
      class="md-transparent project-area__area-size">
      <span class="md-subheading">{{ $t('area_size') }}: <strong>{{ area }}m<sup>2</sup></strong></span>
      <md-button :to="`/${locale}/new-project`" class="md-primary">{{ $t('change_area') }}</md-button>
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
          class="project-area__options">
          <md-list-item
            v-for="option in setting.options"
            :key="option.value">
            <md-checkbox
              v-if="setting.multiple && !setting.isSelect"
              :value="!projectAreaSettings[setting.key][option.value]"
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
            @click="setActiveTooltip(setting.key)">
            <md-icon>info</md-icon>
            <md-tooltip :md-active="activeTooltipKey === setting.key" md-direction="top">
              {{ setting.infoText }}
            </md-tooltip>
          </md-button>
        </md-list>

        <md-list
          v-else
          class="project-area__select">
          <div style="max-width: 90%; flex-grow: 1;">
            <md-list-item>
              <select-input
                :options="setting.options"
                :value="projectAreaSettings[setting.key]"
                :id="setting.key"
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
            @click="setActiveTooltip(setting.key)">
            <md-icon>info</md-icon>
            <md-tooltip :md-active="activeTooltipKey === setting.key" md-direction="top">
              {{ setting.infoText }}
            </md-tooltip>
          </md-button>
        </md-list>
      </section>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { SelectInput } from '~/components'

export default {
  middleware: ['access-level-project-area'],
  components: { SelectInput },
  data() {
    return {
      activeTooltipKey: '',
    }
  },
  computed: {
    ...mapState({
      locale: state => state.i18n.locale,
      projectArea: state => state.project.settings.area,
    }),
    ...mapGetters({
      projectAreaSettings: 'project/settingsProjectArea',
      areaSettings: 'data/areaSettings/overriddenAreaSettings',
    }),
    area() { return this.projectArea.properties && Math.round(this.projectArea.properties.area) },
  },
  methods: {
    ...mapActions({
      updateProjectAreaSetting: 'project/updateProjectAreaSetting',
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
</style>
