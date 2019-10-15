<template>
  <md-button
    class="md-icon-button"
    @click="toggle"
  >
    <md-icon>info</md-icon>
    <md-tooltip :md-active="active" md-direction="top">
      {{ message }}
    </md-tooltip>
  </md-button>
</template>

<script>
import EventBus, { CLICK } from "~/lib/event-bus";

export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  data: () => ({
      active: false,
  }),
  watch: {
    async active(show) {
      setTimeout(() => {
        if (show) {
          EventBus.$on(CLICK, this.toggle)
        } else {
          EventBus.$off(CLICK, this.toggle)
        }
      }, 10)
    },
  },
  methods: {
    toggle(event) {
      this.active = !this.active
    },
  },
}
</script>

<style>
</style>
