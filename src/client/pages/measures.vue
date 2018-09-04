<template>
  <aside class="container">
    <header class="header">
      <h2>Measures</h2>
    </header>
    <section class="measures">
      <ul class="measures__list">
        <li
          v-for="measure in measures"
          :key="measure.id"
          class="measures__list__item">
          
          <measure-card :measure="measure" />
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import { MeasureCard } from '~/components'

export default {
  components: { MeasureCard },
  computed: {
    ...mapState('data', ['measures']),
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.container {
  padding: 2rem;
  height: 100%;
  overflow: scroll;
}

.header {
  margin-bottom: 2rem;
}

.measures {
  max-width: 700px;
}

.measures__list {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.measures__list__item {
  list-style-type: none;
}
</style>
