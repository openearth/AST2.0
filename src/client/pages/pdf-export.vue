<template>
  <div class="pdf-export">
    <div>
      <h1 class="pdf-export__title md-headline">
        {{ $t('results') }} {{ workspaceTitle }}
        <br>
        {{ title }}
      </h1>
      <p v-html="description" />
      <br>
      <img :src="appConfig.pdfLogos.url">
    </div>
    <pdf-export-map />
    <template v-if="currentFilledInLevel.level >= 5">
      <pdf-export-result-summary />
      <pdf-export-results />
      <pdf-export-projectarea-settings />
      <pdf-export-measures-list />
    </template>

    <footer class="pdf-export__footer">
      <img src="https://www.datocms-assets.com/7033/1597758963-deltareslogod-blauwrgb.svg" width="160px">
    </footer>
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
    ...mapState('data', ['appConfig', 'workspaces']),
    ...mapGetters('data/workspaces', ['activeWorkspace']),
    ...mapGetters('flow', ['currentFilledInLevel']),
    workspaceTitle() {
      try {
        return this.activeWorkspace.applicationTitle
      } catch (error) {
        return ''
      }
    },
    title() {
      return startCase(this.settings.general.title)
    },
    description() {
      return this.$t('pdf_tool_description').replace(/\n/g, '<br />')
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
  color: var(--primary-color);
}

.pdf-export__title {
  margin-top: 0;
  text-align: center;
}

.pdf-export__footer {
  position: fixed;
  bottom: 0cm;
  right: 1cm;
}
</style>
