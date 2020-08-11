<template>
  <article class="pdf-export-result-summary">
    <h2 class="md-title">
      {{ $t('results') }} - {{ $t('summary') }}
    </h2>
    <template>
      <kpi-group
        v-for="kpiGroup in filteredKpiGroups"
        :key="kpiGroup.key"
        :kpi-group="kpiGroup"
        type="numbers"
        :kpi-values="filteredKpiValues"
        :kpi-percentage-values="filteredKpiPercentageValues"
      />
    </template>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'
import KpiGroup from '../kpi-group'

export default {
  components: { KpiGroup },
  computed: {
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups']),
  },
}
</script>

<style>
.pdf-export-result-summary {
  width: 50vw;
}

.pdf-export-result-summary .kpi-group__kpi .md-list-item-content {
  min-height: initial;
}
</style>
