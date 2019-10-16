<template>
  <section :class="{ 'kpi-panel__has-footer': hasFooter }" class="kpi-panel">
    <div class="kpi-panel__header">
      <h4 class="md-title kpi-panel__title">{{ $t('results') }}</h4>

      <div class="kpi-panel__filter">
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
      <md-button class="md-raised" @click="togglePopup(true)">{{ $t('view_as_table') }}</md-button>
      <app-popup
        v-if="openState"
        :title="$t('results')"
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
  width: var(--width-extra-small);
  padding-right: var(--spacing-default);
  padding-bottom: var(--spacing-default);
  padding-left: var(--spacing-default);
  overflow-y: auto;
}

@media screen and (min-width: 1200px) {
  .kpi-panel {
    width: var(--width-medium);
  }
}

.kpi-panel__has-footer {
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.kpi-panel__header {
  width: calc(100% + var(--spacing-default) * 2);
  margin-bottom: var(--spacing-default);
  margin-left: calc( var(--spacing-default) * -1 );

  padding: var(--spacing-default);

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  background-color: var(--md-theme-default-toolbarvariant, #f5f5f5);
}

.kpi-panel__title {
  width: 100%;
  font-weight: 400;
}

@media screen and (min-width: 1200px) {
  .kpi-panel__title {
    width: auto;
  }
}

.kpi-panel__filter {
  margin-left: -8px; /* align buttons to headline // 8px from padding of ripple inside button */
}

@media screen and (min-width: 1200px) {
  .kpi-panel__filter {
    margin-left: 0;
  }
}

@media screen and (min-width: 1200px) {
  .kpi-panel__filter {
    margin-left: 0;
  }
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
  border-top: 1px solid var(--border-color);
  background-color: var(--background-color);
}
</style>
