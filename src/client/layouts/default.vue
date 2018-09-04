<template>
  <div class="layout-default">
    <app-header class="layout-default__app-header"/>
    <section class="layout-default__project">
      <nuxt class="layout-default__page"/>
      <map-viewer class="layout-default__map"/>
      <kpi-panel />
    </section>
  </div>
</template>

<script>
import { AppHeader, MapViewer, KpiPanel } from '../components'
export default {
  components: { AppHeader, MapViewer, KpiPanel },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout-default {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-default__app-header {
  height: 50px;
}

.layout-default__project {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.layout-default__map {
  flex: 1;
}

</style>
