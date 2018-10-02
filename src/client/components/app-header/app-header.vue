<template>
  <md-toolbar class="md-primary">
    <div class="md-toolbar-section-start">
      <h2 class="md-title">{{ $t('ast') }}</h2>
    </div>

    <div class="md-toolbar-section-end">
      <transition-group name="list-complete" >
        <md-button
          v-if="currentFilledInLevel.level >= 2"
          :key="2"
          :to="`/${this.$i18n.locale}/settings/general`"
          class="md-primary md-icon-button">
          <md-icon>settings</md-icon>
        </md-button>
      </transition-group>
    </div>
  </md-toolbar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters('flow', ['currentFilledInLevel']),
  },
}
</script>

