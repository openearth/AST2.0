<template>
  <select :value="(activeWorkspace || {}).unitSystem" @input="handleInput">
    <option value="metric">
      Metric
    </option>
    <option value="imperial">
      Imperial
    </option>
  </select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('data/workspaces', ['activeWorkspace']),
  },
  methods: {
    handleInput(event) {
      const updatedWorkspace = { ...this.activeWorkspace, ...{ unitSystem: event.target.value } }
      this.$store.commit('data/workspaces/fillWorkspace', updatedWorkspace)
    },
  },
}
</script>
