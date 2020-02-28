<template>
  <md-button
    class="md-icon-button"
    @click="toggle"
  >
    <md-icon>info</md-icon>
    <md-tooltip
      :md-active="active"
      :md-direction="direction"
      :class="{'app-tooltip__tooltip-wrapper': direction === 'left'}"
    >
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
    direction: {
      type: String,
      default: 'top',
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
  .app-tooltip__tooltip-wrapper {
    height: initial;
    white-space: initial;
    max-width: 400px;
    line-height: 1.25;
    padding-top: 0.5em;
    padding-bottom: 0.75em;
  }
</style>
