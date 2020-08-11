<template>
  <section :class="{ 'kpi-panel__has-footer': hasFooter }" class="kpi-panel">
    <div class="kpi-panel__content">
      <kpi-group
        v-for="kpiGroup in kpis"
        :key="kpiGroup.key"
        :kpi-group="kpiGroup"
        :type="displayType"
        :kpi-values="kpiValues"
        :kpi-percentage-values="kpiPercentageValues"
        :selected-areas="selectedAreas"
        class="kpi-panel__kpi-group"
      />
    </div>

    <footer v-if="hasFooter" class="kpi-panel__footer">
      <md-button class="md-raised" @click="togglePopup(true)">
        {{ $t('view_as_table') }}
      </md-button>
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
import { mapGetters, mapMutations } from 'vuex'
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
    displayType: {
      type: String,
      required: true,
      validator: value => /numbers|bars/.test(value),
    },
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
  border-top: 1px solid var(--border-color);
  background-color: var(--background-color);
}
</style>
