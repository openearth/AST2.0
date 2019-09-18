<template>
  <aside :class="{ 'measure-aside__wide': isWide }" class="measure-aside">
    <slot/>
  </aside>
</template>

<script>
export default {
  props: {
    wide: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isWide() {
      return this.wide
    },
  },
}
</script>

<style>
.measure-aside {
  width: var(--width-medium);
  background-color: var(--background-color);
}

.measure-aside__wide {
  width: 100%;
  min-width: 400px;
  max-width: calc(100vw - var(--width-large));
}
</style>
