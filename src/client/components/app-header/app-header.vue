<template>
  <md-toolbar class="md-primary">
    <div class="md-toolbar-section-start">
      <h2 class="md-title">{{ $t('ast') }}</h2>
    </div>

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
import { mapGetters } from "vuex";
import { LEVEL_PROJECT_AREA } from "../../lib/flow-levels";

export default {
  data: () => ({ LEVEL_PROJECT_AREA }),
  computed: {
    ...mapGetters('flow', ['currentFilledInLevel']),
  },
}
</script>

