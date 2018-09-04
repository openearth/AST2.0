<template>
  <aside class="container">
    <header class="header">
      <h2>Measures</h2>
    </header>
    <section class="measures">
      <ul class="measures__list">
        <li
          v-for="measure in orderedMeasures"
          :key="measure.id"
          class="measures__list__item">
          
          <measure-card :measure="measure" />
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex"
import { MeasureCard } from '~/components'

export default {
  components: { MeasureCard },
  computed: {
    ...mapState('data', ['measures']),
    ...mapGetters('data/measures', ['orderedMeasures', 'filteredMeasures']),
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.container {
  padding: var(--spacing-double);
  height: 100%;
  overflow: scroll;
}

.header {
  margin-bottom: var(--spacing-double);
}

.measures {
  max-width: 700px;
}

.measures__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
}

.measures__list__item {
  margin-bottom: var(--spacing-double);
  list-style-type: none;
}
</style>
