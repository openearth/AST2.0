<template>
  <article class="pdf-export-results">
    <h2 class="md-title">
      Results
    </h2>
    <div class="pdf-export-results__content">
      <kpi-table :show-table-co-benefits="false" class="pdf-export-results__table" />
      <br>
      <kpi-table :show-table-climate-and-costs="false" class="pdf-export-results__table" />
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import KpiTable from '../kpi-table'

export default {
  components: { KpiTable },
  computed: {
    ...mapGetters('project', ['tableClimateAndCosts', 'tableCoBenefits']),
  },
}
</script>

<style>
.pdf-export-results {
  width: 100%;
  font-size: 10pt;
  page-break-before: always;
}

.pdf-export-results__content * {
  font-size: 8pt;
}

.pdf-export-results__table:not(:first-child) {
  page-break-before: always;
}
</style>
