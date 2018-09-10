<template>
  <aside>
    <h1>Areas</h1>
    <ul>
      <li v-for="feature in selectedFeatures" :key="feature.id">
        <p>{{ feature.id }}</p>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      selectedFeatures: 'selectedAreas/features',
    }),
  },
}
</script>
