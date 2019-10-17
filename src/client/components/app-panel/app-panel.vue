<template>
  <aside :class="{ 'app-panel__wide': wide }" class="app-panel">
    <section class="app-panel__content">
      <slot/>
    </section>
    <span class="spacer"/>
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
  position: relative;
  z-index: 2;

  width: var(--width-medium);
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow-y: auto;

  background-color: var(--background-color);
}

.device-mobile.device-Safari .app-panel {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.app-panel__content {
  position: relative;
  z-index: 1;
}

.app-panel__wide {
  width: 100%;
  max-width: var(--width-small);
}

@media screen and (min-width: 1200px) {
  .app-panel__wide {
    min-width: 400px;
    max-width: calc(100vw - var(--width-large));
  }
}

/* overwriting default styles for .md-toolbar */
.app-panel__content .md-toolbar {
  background-color: transparent;
}

/** assuming the footer has a height of ~80px */
.spacer {
  flex-grow: 2;
  min-height: 80px;
}

.app-panel__footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: var(--spacing-default);
  z-index: 10;

  text-align: right;
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
}
</style>
