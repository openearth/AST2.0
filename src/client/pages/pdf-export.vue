<template>
  <div>
    <h1>PDF Export</h1>
    <pdf-export-measures-list />
  </div>
</template>

<script>
import PdfExportMeasuresList from '../components/pdf-export/pdf-export-measures-list'
export default {
  layout: 'pdf-export',
  components: { PdfExportMeasuresList },
}
</script>
