<template>
  <div>
    <h2>{{ $t('project_area') }}</h2>
    <div v-if="area">{{ area }}m2</div>
    <form @submit="onSubmit">
      <input type="text">
    </form>
  </div>   
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      projectArea: state => state.project.settings.projectArea,
    }),
    area() { return this.projectArea.properties.area.toFixed(2) },
  },
  methods: {
    onSubmit() {
      // TODO handle submit
    },
  },
}
</script>

<style>

</style>
