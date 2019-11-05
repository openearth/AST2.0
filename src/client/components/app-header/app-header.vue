<template>
  <md-toolbar class="md-primary" role="banner">
    <section class="md-toolbar-section-start">
      <md-button
        :disabled="inSetMeasureFlow"
        :class="{'app-header__button--disabled': inSetMeasureFlow}"
        class="md-icon-button"
        @click="() => $emit('onShowNavigation')">
        <md-icon>menu</md-icon>
      </md-button>

      <h1
        :class="{
          'md-subheading': hasTitle,
          'md-title': !hasTitle
        }"
      >
        {{ title }}</h1>
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
      <md-button
        v-if="currentFilledInLevel.level >= LEVEL_PROJECT_AREA"
        :disabled="inSetMeasureFlow"
        :class="{'app-header__button--disabled': inSetMeasureFlow}"
        :key="2"
        :to="`/${this.$i18n.locale}/settings/project-area/`"
        class="md-primary md-icon-button">
        <md-icon>settings</md-icon>
      </md-button>
      <fullscreen-button />
      <LogIn
        v-if="legalAccepted"
        :disabled="inSetMeasureFlow"
        :class="{'app-header__button--disabled': inSetMeasureFlow}"/>
    </section>
  </md-toolbar>
</template>

<script>
import startCase from 'lodash/startCase'
import { mapGetters, mapState } from "vuex";
import { LEVEL_PROJECT_AREA } from "../../lib/flow-levels";
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
    ...mapState({ inSetMeasureFlow: state => state.setMeasureFlow.inFlow }),
    hasTitle() {
      return !!this.projectTitle
    },
    formattedTitle() {
      return startCase(this.projectTitle)
    },
  },
}
</script>

<style>
.app-header__button--disabled {
  opacity: 0.5;
}
</style>
