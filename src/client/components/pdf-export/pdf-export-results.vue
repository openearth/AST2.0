<template>
  <article class="pdf-export-results">
    <h2 class="md-title">
      {{ $t('results') }} - {{ $t('detail') }}
    </h2>
    <div ref="content" class="pdf-export-results__content">
      <div ref="coBenefits" class="pdf-export-results__table">
        <kpi-table :show-table-co-benefits="false" />
      </div>
      <br>
      <div ref="climateCosts" class="pdf-export-results__table">
        <kpi-table :show-table-climate-and-costs="false" />
      </div>
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
      const tableCoBenefitsElement = this.$refs.coBenefits.querySelector('table')
      const tableClimateCostsElement = this.$refs.climateCosts.querySelector('table')
      const coBenefitsInnerContentElement = this.$refs.coBenefits.querySelector('.md-table')
      const climateCostsInnerContentElement = this.$refs.climateCosts.querySelector('.md-table')
      const scale = contentElement.clientWidth / tableCoBenefitsElement.clientWidth
      tableCoBenefitsElement.style.transformOrigin = 'top left'
      tableCoBenefitsElement.style.transform = `scale(${scale}) translateX(-${scale}%)`
      coBenefitsInnerContentElement.style.height = `${coBenefitsInnerContentElement.clientHeight * scale}px`

      tableClimateCostsElement.style.transformOrigin = 'top left'
      tableClimateCostsElement.style.transform = `scale(${scale}) translateX(-${scale}%)`
      climateCostsInnerContentElement.style.height = `${climateCostsInnerContentElement.clientHeight * scale}px`
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

.pdf-export-results__table {
  page-break-inside: avoid;
}
</style>
