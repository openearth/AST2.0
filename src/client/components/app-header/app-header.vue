<template>
  <md-toolbar class="md-primary" role="banner">
    <section class="md-toolbar-section-start">
      <md-button class="md-icon-button" @click="() => $emit('on-show-navigation')">
        <md-icon>menu</md-icon>
      </md-button>

      <h1
        :class="{
          'md-subheading': hasTitle,
          'md-title': !hasTitle
        }"
      >
        {{ title }}
      </h1>
    </section>

    <small
      v-if="hasTitle"
      :class="{
        'md-subheading': !hasTitle,
        'md-title': hasTitle
      }"
    >
      {{ formattedTitle }}
    </small>

    <section class="md-toolbar-section-end">
      <template
        v-if="currentFilledInLevel.level >= LEVEL_PROJECT_AREA"
      >
        <md-progress-spinner
          v-if="fetchingApiData"
          :md-diameter="24"
          :md-stroke="3"
          md-mode="indeterminate"
          class="md-accent"
        />
        <md-button
          v-if="activeWorkspace.showScenarioExamplesInSettings"
          class="md-primary md-icon-button"
          @click="showScenarios"
        >
          <md-icon>location_city</md-icon>
        </md-button>
        <md-button
          :key="2"
          :to="`/${this.$i18n.locale}/settings/project-area/`"
          class="md-primary md-icon-button"
        >
          <md-icon>settings</md-icon>
        </md-button>
      </template>
      <fullscreen-button />
      <LogIn v-if="legalAccepted" />
    </section>
  </md-toolbar>
</template>

<script>
import startCase from 'lodash/startCase'
import { mapGetters, mapMutations, mapState } from 'vuex';
import { LEVEL_PROJECT_AREA } from '../../lib/flow-levels';
import FullscreenButton from '../fullscreen-button'
import LogIn from '../log-in'

export default {
  components: {
    FullscreenButton,
    LogIn,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    legalAccepted: {
      type: Boolean,
      required: true,
    },
    projectTitle: {
      type: String,
      default: '',
    },
  },
  data: () => ({ LEVEL_PROJECT_AREA }),
  computed: {
    ...mapState({
      fetchingApiData: state => state.flow.fetchingApiData,
    }),
    ...mapGetters('flow', ['currentFilledInLevel']),
    ...mapGetters('data/workspaces', ['activeWorkspace']),
    hasTitle() {
      return !!this.projectTitle
    },
    formattedTitle() {
      return startCase(this.projectTitle)
    },
  },
  methods: {
    ...mapMutations({
      showScenarios: 'flow/showScenarios',
    }),
  },
}
</script>
