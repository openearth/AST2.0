<template>
  <article v-if="rivmCoBenefits" class="pdf-export-rivm">
    <h2 class="md-title">
      {{ $t('pdf_rivm') }}
    </h2>
    <app-results-rivm
      :show-footer="false"
      :data="rivmCoBenefits"
      :dato-content="kbsResultContent"
    />
  </article>
</template>

<script>
import { mapState } from 'vuex'
import AppResultsRivm from '../app-results-rivm'
import getData from '~/lib/get-data'

export default {
  components: { AppResultsRivm },
  data() {
    return {
      kbsResultContent: {},
    }
  },
  computed: {
    ...mapState({
      rivmCoBenefits: state => state.project.rivmCoBenefits,
    }),
  },
  async beforeMount() {
    const locale = this.$i18n.locale
    const { kbsResult } = await getData({ locale, slug: 'kbs-results' })
    this.kbsResultContent = { ...kbsResult }
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
