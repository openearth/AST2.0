<template>
  <section class="kpi-panel">
    <div class="kpi-panel__header">
      <h4>{{ $t('results') }}</h4>

      <div>
        <md-button class="md-icon-button" @click="displayType = 'numbers'">
          <md-icon>format_list_numbered_rtl</md-icon>
        </md-button>

        <md-button class="md-icon-button" @click="displayType = 'bars'">
          <md-icon>insert_chart_outlined</md-icon>
        </md-button>
      </div>
    </div>

    <kpi-group
      v-for="kpiGroup in kpis"
      :key="kpiGroup.key"
      :kpi-group="kpiGroup"
      :type="displayType"
      :kpi-values="kpiValues"
      class="kpi-panel__kpi-group" />
  </section>
</template>

<script>
import { KpiGroup } from '~/components'

export default {
  components: { KpiGroup },
  props: {
    kpis: {
      type: Array,
      required: true,
    },
    kpiValues: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      displayType: 'bars',
    }
  },
}
</script>

<style>
.kpi-panel {
  padding: var(--spacing-default);
  width: var(--width-small);
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

.kpi-panel__kpi-group {
  width: 100%;
  padding: 0;
}
</style>
