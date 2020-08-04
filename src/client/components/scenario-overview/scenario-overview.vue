<template>
  <aside class="scenario-overview">
    <md-button @click="showPopup = true">
      {{ $t('scenario_examples') }}
    </md-button>
    <app-popup
      v-if="showPopup"
      :title="$t('scenario_examples')"
      @closePopup="showPopup = false"
    >
      <div class="scenario-overview__content">
        <md-tabs :md-active-tab="initialTab" @md-changed="newActiveTab => activeTab = newActiveTab">
          <md-tab
            v-for="scenario in scenarios"
            :id="scenario.value"
            :key="scenario.value"
            :md-label="scenario.title"
          />
        </md-tabs>
        <section class="scenario-overview__tab-content">
          <div class="scenario-overview__tab-content-wrapper">
            <div
              v-for="(item, index) in activeScenario.example"
              :key="index"
              :class="{
                'scenario-overview__tab-content--text': Boolean(item.text),
                'scenario-overview__tab-content--image': Boolean(item.image),
              }"
            >
              <rich-text
                v-if="item.text"
                :text="item.text"
              />
              <responsive-image
                v-if="item.image"
                :image="{...item.image, title: item.title}"
              />
            </div>
          </div>
        </section>
        <md-button class="scenario-overview__choose-btn md-raised md-primary" @click="choose">
          {{ $t('choose') }} {{ activeTabLabel }}
        </md-button>
      </div>
    </app-popup>
  </aside>
</template>

<script>
import AppPopup from '../app-popup'
import RichText from '../rich-text'
import ResponsiveImage from '../responsive-image'

export default {
  components: { AppPopup, RichText, ResponsiveImage },
  props: {
    value: {
      type: String,
      default: undefined,
    },
    scenarios: {
      type: Array,
      default: () => [],
    },
  },
  data( ) {
    return {
      showPopup: false,
      activeTab: undefined,
    }
  },
  computed: {
    initialTab() {
      return this.value
    },
    activeScenario() {
      return this.scenarios.find(option => option.value === this.activeTab)
    },
    activeTabLabel() {
      const activeOption = this.activeScenario || {}
      return activeOption.title || ''
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
  display: flex;
  flex-direction: column;
  padding: var(--spacing-default);
  height: 80vh;
}

.scenario-overview__content > *:not(:first-child):not(:last-child) {
  flex: 1;
}

.scenario-overview__tab-content {
  padding: var(--spacing-default) 0;
}

.scenario-overview__tab-content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.scenario-overview__tab-content--text {
  grid-column: 1 / -1;
}

.scenario-overview__choose-btn {
  align-self: flex-end;
  flex-grow: 0;
}
</style>
