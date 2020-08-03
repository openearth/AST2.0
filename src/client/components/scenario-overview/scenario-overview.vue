<template>
  <aside class="scenario-overview">
    <md-button @click="showPopup = true">{{ $t('scenario_examples') }}</md-button>
    <app-popup
      v-if="showPopup"
      :title="$t('scenario_examples')"
      @closePopup="showPopup = false">
      <div class="scenario-overview__content">
        <md-tabs :md-active-tab="initialTab" @md-changed="newActiveTab => activeTab = newActiveTab">
          <md-tab
            v-for="option in activeWorkspace.scenarioName.options"
            :key="option.value"
            :id="option.value"
            :md-label="option.title">
            {{ option.title }}
          </md-tab>

        </md-tabs>
        <md-button @click="choose">{{ $t('choose') }}</md-button>
      </div>
    </app-popup>
  </aside>
</template>

<script>
import AppPopup from '../app-popup'
import { mapGetters } from 'vuex'
export default {
  components: { AppPopup },
  props: {
    value: {
      type: String,
      default: undefined,
    },
  },
  data( ) {
    return {
      showPopup: false,
      activeTab: undefined,
    }
  },
  computed: {
    ...mapGetters('data/workspaces', ['activeWorkspace']),
    initialTab() {
      return this.value
    },
  },
  watch: {
    value(val) {
      this.activeTab = val
    },
  },
  created() {
    this.activeTab = this.value
  },
  methods: {
    choose() {
      this.$emit('choose-scenario', this.activeTab)
      this.showPopup = false
    },
  },
}
</script>

<style>
.scenario-overview {
  display: flex;
  justify-content: flex-end;
}

.scenario-overview__content {
  padding: var(--spacing-default);
}
</style>
