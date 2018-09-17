<template>
  <div>
    <md-subheader class="md-title">Measure List</md-subheader>

    <md-field>
      <md-icon>search</md-icon>
      <label>Search</label>
      <md-input v-model="searchValue"/>
      <md-icon>keyboard_voice</md-icon>
    </md-field>

    <ul class="measure-list__list">
      <li
        v-for="measure in measures"
        :key="measure.id"
        class="measure-list__item">
        <measure-card
          :measure="measure"
          :scores="['foo', 'bar']"
          class="measure-list__card"
          @choose="choose"/>
      </li>
    </ul>
  </div>
</template>

<script>
import { MeasureCard } from "..";
export default {
  components: { MeasureCard },
  props: {
    measures: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    searchValue: '',
  }),
  methods: {
    choose(value) {
      this.$emit('choose', value)
    },
  },
}
</script>

<style>
.measure-list__list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  padding: 1rem;
}


.measure-list__card {
  height: 100%;
}
</style>
