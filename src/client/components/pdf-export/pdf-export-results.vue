<template>
  <article class="pdf-export-results">
    <h2 class="md-title">
      {{ $t('results') }} - {{ $t('detail') }}
    </h2>
    <div ref="content" class="pdf-export-results__content">
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
  mounted() {
    this.$nextTick(() => {
      const contentElement = this.$refs.content
      const tableElement = this.$refs.content.querySelector('table')
      const innerContentElement = this.$refs.content.querySelector('.md-table')
      const scale = contentElement.clientWidth / tableElement.clientWidth
      tableElement.style.transformOrigin = 'top left'
      tableElement.style.transform = `scale(${scale}) translateX(-${scale}%)`
      innerContentElement.style.height = `${innerContentElement.clientHeight * scale}px`
    })
  },
}
</script>

<style>
.pdf-export-results {
  width: 100%;
  font-size: 10pt;
  page-break-before: always;
}
</style>
