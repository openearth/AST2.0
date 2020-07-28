<template>
  <div class="pdf-export">
    <h1 class="pdf-export__title md-headline">{{ title }}</h1>
    <pdf-export-measures-list />
    <pdf-export-results />
  </div>
</template>

<script>
import startCase from 'lodash/startCase'
import { mapState } from 'vuex'
import PdfExportMeasuresList from '../components/pdf-export/pdf-export-measures-list'
import PdfExportResults from '../components/pdf-export/pdf-export-results'
export default {
  layout: 'pdf-export',
  components: { PdfExportMeasuresList, PdfExportResults },
  computed: {
    ...mapState('project', ['settings']),
    title() {
      return startCase(this.settings.general.title)
    },
  },
}
</script>

<style>
.pdf-export > *:not(:first-child) {
  margin-top: 1cm;
}

.pdf-export__title {
  text-align: center;
}
</style>
