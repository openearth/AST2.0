<template>
  <app-popup
    :title="$t('scenario_examples')"
    @closePopup="hideScenarios"
  >
    <div class="scenario-overview__popup">
      <div class="scenario-overview__content">
        <ul class="scenario-overview__tabs">
          <li v-for="scenario in scenarios" :key="scenario.value">
            <md-button
              :class="{'md-accent': activeTab == scenario.value}"
              @click="activeTab = scenario.value"
            >
              {{ scenario.title }}
            </md-button>
          </li>
        </ul>
        <section class="scenario-overview__tab-content">
          <div class="scenario-overview__tab-content-wrapper">
            <h3 class="scenario-overview__tab-content-title md-headline">
              {{ activeScenario.title }}
            </h3>
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
      </div>
      <md-button
        class="scenario-overview__choose-btn md-raised md-accent"
        :disabled="activeScenario === nonChosenScenario"
        @click="choose"
      >
        {{ $t('choose') }} {{ activeTabLabel }}
      </md-button>
    </div>
  </app-popup>
</template>

<script>
import { mapMutations } from 'vuex'
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
      activeTab: undefined,
      nonChosenScenario: { title: '', example: [] },
    }
  },
  computed: {
    initialTab() {
      return this.value
    },
    activeScenario() {
      return this.scenarios.find(option => option.value === this.activeTab) || this.nonChosenScenario
    },
    activeTabLabel() {
      const activeOption = this.activeScenario
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
    ...mapMutations({
      hideScenarios: 'flow/hideScenarios',
    }),
    choose() {
      this.$emit('choose-scenario', this.activeTab)
      this.hideScenarios()
    },
  },
}
</script>

<style>
.scenario-overview__popup {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-default);
  height: 80vh;
}

.scenario-overview__popup > *:not(:last-child) {
  flex: 1;
}

.scenario-overview__content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--spacing-default);
  overflow: hidden;
}

.scenario-overview__tabs {
  padding: 0;
  margin: 0;
  list-style: none;
  position: sticky;
  top: 0;
  height: 100%;
  overflow-y: scroll;
}

.scenario-overview__tab-content {
  max-height: 100%;
  overflow: scroll;
}

.scenario-overview__choose-btn {
  align-self: flex-end;
  flex-grow: 0;
  flex-shrink: 0;
}

.scenario-overview__tab-content-title {
  padding-bottom: var(--spacing-half);
}

.scenario-overview__popup .md-tabs-navigation .md-button-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scenario-overview__tab-content--text .rich-text {
  max-width: initial;
}
</style>
