<template>
  <md-drawer md-permanent="clipped" class="settings-view">
    <md-tabs md-sync-route class="settings-view__tabs">
      <template slot="md-tab" slot-scope="{ tab }">
        <div :class="{'settings-view__tab-error': tab.data.error}">{{ tab.label }}</div>
      </template>

      <md-tab
        id="tab-general"
        :to="`/${locale}/settings/general/`"
        :md-label="$t('general')"/>
      <md-tab
        id="tab-project-area"
        :to="`/${locale}/settings/project-area/`"
        :md-label="$t('project_area')"/>
      <md-tab
        id="tab-project-target"
        :md-disabled="!filledInRequiredProjectAreaSettings"
        :md-template-data="{ error: !filledInTargets }"
        :to="`/${locale}/settings/project-target/`"
        :md-label="$t('project_target')"/>
    </md-tabs>

    <nuxt-child class="settings-view__content"/>

    <div class="settings-view__action-wrapper">
      <transition name="slide-up">
        <md-button
          v-if="!isLastTab"
          :key="1"
          :to="`/${locale}/settings/${nextTabKey}/`"
          :disabled="nextTabDisabled"
          :class="{'md-primary': !filledInRequiredProjectAreaSettings}"
          class="md-raised">{{ $t('next') }}</md-button>
      </transition>
      <transition name="slide-up">
        <md-button
          v-if="filledInRequiredProjectAreaSettings"
          :disabled="!filledInSettings"
          :key="2"
          :to="`/${locale}/project`"
          class="md-primary md-raised">{{ $t('done') }}</md-button>
      </transition>
    </div>
  </md-drawer>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MapEventBus, { REDRAW } from "../lib/map-event-bus"

export default {
  layout: 'inactive-map',
  middleware: ['settings-root'],
  data: () => ({
    tabs: [
      {
        key: 'general',
        validatorKey: 'createdProjectArea',
      },
      {
        key: 'project-area',
        validatorKey: 'createdProjectArea',
      },
      {
        key: 'project-target',
        validatorKey: 'filledInRequiredProjectAreaSettings',
      },
    ],
  }),
  computed: {
    ...mapState('i18n', ['locale']),
    ...mapGetters('flow', ['createdProjectArea', 'filledInRequiredProjectAreaSettings', 'filledInTargets', 'filledInSettings']),
    currentTabIndex() {
      const path = this.$route.fullPath.replace(`/${this.locale}/settings/`, '').replace('/', '')
      const obj = this.tabs.find(tab => tab.key === path)
      return this.tabs.indexOf(obj)
    },
    nextTabIndex() {
      const index = this.currentTabIndex
      return index + 1 < this.tabs.length ? index + 1 : index
    },
    nextTabKey() {
      return this.tabs[this.nextTabIndex].key
    },
    nextTabDisabled() {
      return !this[this.tabs[this.nextTabIndex].validatorKey]
    },
    isLastTab() {
      return this.currentTabIndex === (this.tabs.length - 1)
    },
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
}
</script>

<style>
.settings-view {
  display: flex;
  flex-direction: column;
  width: 800px;
}

.settings-view__content {
  flex: 1;
  overflow-y: scroll;
}

.settings-view__action-wrapper {
  display: flex;
  justify-content: flex-end;
}

.settings-view__tab-error {
  position: relative;
}

.settings-view__tab-error::after {
  width: 0.5rem;
  height: 0.5rem;
  background-color: red;
  content: '';
  position: absolute;
  border-radius: 100%;
  transform: translate(25%, 25%)
}
</style>
