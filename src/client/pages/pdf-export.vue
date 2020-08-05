<template>
  <div class="pdf-export">
    <h1 class="pdf-export__title md-headline">
      Resultaten {{ appConfig && appConfig.title }} - {{ title }}
    </h1>
    <p>Dummy text over de tool</p>
    <pdf-export-map />
    <template v-if="currentFilledInLevel.level >= 5">
      <pdf-export-result-summary />
      <pdf-export-results />
      <pdf-export-projectarea-settings />
      <pdf-export-measures-list />
    </template>
  </div>
</template>

<script>
import startCase from 'lodash/startCase'
import { mapState, mapGetters } from 'vuex'
import PdfExportMeasuresList from '../components/pdf-export/pdf-export-measures-list'
import PdfExportResults from '../components/pdf-export/pdf-export-results'
import PdfExportMap from '../components/pdf-export/pdf-export-map'
import PdfExportResultSummary from '../components/pdf-export/pdf-export-result-summary'
import PdfExportProjectareaSettings from '../components/pdf-export/pdf-export-projectarea-settings'

export default {
  layout: 'pdf-export',
  components: { PdfExportMap, PdfExportMeasuresList, PdfExportResults, PdfExportResultSummary, PdfExportProjectareaSettings },
  computed: {
    ...mapState('project', ['settings']),
    ...mapState('data', ['appConfig']),
    ...mapGetters('flow', ['currentFilledInLevel']),
    title() {
      return startCase(this.settings.general.title)
    },
  },
}
</script>

<style>
.pdf-export {
  padding: 1cm;
}

.pdf-export > *:not(:last-child) {
  margin-bottom: 2cm;
  page-break-inside: avoid;
}

.pdf-export .md-headline,
.pdf-export .md-title {
  color: var(--action-color);
}

.pdf-export__title {
  text-align: center;
}
</style>
