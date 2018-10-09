<template>
  <md-toolbar class="md-primary">
    <div class="md-toolbar-section-start">
      <md-button class="md-icon-button" @click="() => $emit('onShowNavigation')">
        <md-icon>menu</md-icon>
      </md-button>

      <h2
        :class="{
          'md-subheading': hasTitle,
          'md-title': !hasTitle
        }"
      >{{ $t('ast') }}</h2>
    </div>

    <small
      v-if="hasTitle"
      :class="{
        'md-subheading': !hasTitle,
        'md-title': hasTitle
      }"
    >{{ formattedTitle }}</small>

    <div class="md-toolbar-section-end">
      <md-button
        v-if="currentFilledInLevel.level >= LEVEL_PROJECT_AREA"
        :key="2"
        :to="`/${this.$i18n.locale}/settings/project-area/`"
        class="md-primary md-icon-button">
        <md-icon>settings</md-icon>
      </md-button>
    </div>
  </md-toolbar>
</template>

<script>
import startCase from 'lodash/startCase'
import { mapGetters } from "vuex";
import { LEVEL_PROJECT_AREA } from "../../lib/flow-levels";

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data: () => ({ LEVEL_PROJECT_AREA }),
  computed: {
    ...mapGetters('flow', ['currentFilledInLevel']),
    hasTitle() {
      return !!this.title
    },
    formattedTitle() {
      return startCase(this.title.replace('.json', ''))
    },
  },
}
</script>

