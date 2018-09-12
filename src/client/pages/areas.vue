<template>
  <aside>
    <h1>{{ $t('your_measures') }}</h1>
    <ul>
      <li v-for="feature in selectedFeatures" :key="feature.id">
        <p>{{ feature.properties.name }}</p>
        <nuxt-link to="measures">Choose measure</nuxt-link>
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
