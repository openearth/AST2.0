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
        <md-button
          class="md-primary md-icon-button"
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
import { mapGetters } from 'vuex';
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
    ...mapGetters('flow', ['currentFilledInLevel']),
    hasTitle() {
      return !!this.projectTitle
    },
    formattedTitle() {
      return startCase(this.projectTitle)
    },
  },
}
</script>
