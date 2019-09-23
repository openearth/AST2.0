<template>
  <section :class="{ 'kpi-panel__has-footer': hasFooter }" class="kpi-panel">
    <div class="kpi-panel__header">
      <h4 class="md-title">{{ $t('results') }}</h4>

      <div>
        <md-button
          :class="{'md-primary': displayType === 'numbers'}"
          class="md-icon-button"
          @click="displayType = 'numbers'">
          <md-icon>format_list_numbered</md-icon>
        </md-button>

        <md-button
          :class="{'md-primary': displayType === 'bars'}"
          class="md-icon-button"
          @click="displayType = 'bars'">
          <md-icon>insert_chart</md-icon>
        </md-button>
      </div>
    </div>
    <div class="kpi-panel__content">
      <kpi-group
        v-for="kpiGroup in kpis"
        :key="kpiGroup.key"
        :kpi-group="kpiGroup"
        :type="displayType"
        :kpi-values="kpiValues"
        :kpi-percentage-values="kpiPercentageValues"
        :selected-areas="selectedAreas"
        class="kpi-panel__kpi-group" />
    </div>

    <footer v-if="hasFooter" class="kpi-panel__footer">
      <md-button class="md-raised" @click="togglePopup(true)">View as table</md-button>
      <app-popup
        v-if="openState"
        title="Content for the header"
        @closePopup="togglePopup(false)"
      >
        <kpi-table />
      </app-popup>

    </footer>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
import { KpiGroup, AppPopup } from '~/components'
import KpiTable from '~/components/kpi-table'

export default {
  components: { KpiGroup, AppPopup, KpiTable },
  props: {
    kpis: {
      type: Array,
      required: true,
    },
    kpiValues: {
      type: Object,
      required: true,
    },
    kpiPercentageValues: {
      type: Object,
      required: true,
    },
    selectedAreas: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      displayType: 'bars',
    }
  },
  computed: {
    ...mapGetters('popup', ['openState']),
    hasFooter() {
      return true
    },
  },
  mounted() {
    console.log('kpis', this.kpis);
  },
  methods: {
    ...mapMutations({
      openPopup: 'popup/openPopup',
      closePopup: 'popup/closePopup',
    }),
    togglePopup(state) {
      state ? this.openPopup() : this.closePopup()
    },
  },
}
</script>

<style>
.kpi-panel {
  position: relative;
  width: var(--width-medium);
  padding: var(--spacing-default);
  overflow-y: auto;
}

.kpi-panel__has-footer {
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.kpi-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-default);
}

.kpi-panel__header .md-button:last-child {
  margin: 0;
}

.kpi-panel__has-footer .kpi-panel__content {
  flex-grow: 2;
}

.kpi-panel__kpi-group {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0;
}

.kpi-panel__footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  margin-left: calc(-1 * var(--spacing-default));
  width: calc(100% + (var(--spacing-default) * 2));

  padding: var(--spacing-half);

  text-align: right;
  box-shadow: var(--shadow-small-grey);
  background-color: var(--background-color);
}
</style>
