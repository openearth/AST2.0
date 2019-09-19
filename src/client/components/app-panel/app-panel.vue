<template>
  <aside :class="{ 'app-panel__wide': wide }" class="app-panel">
    <section class="app-panel__content">
      <slot/>
    </section>
    <footer class="app-panel__footer">
      <slot name="footer"/>
    </footer>
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
}
</script>

<style>
.app-panel {
  width: var(--width-medium);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--background-color);
}

.app-panel__content {
  flex-grow: 2;
}

.app-panel__wide {
  width: 100%;
  min-width: 400px;
  max-width: calc(100vw - var(--width-large));
}

.app-panel__footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: var(--spacing-default);

  text-align: right;
  background-color: var(--background-color);
  box-shadow: var(--shadow-small-grey);
}
</style>
