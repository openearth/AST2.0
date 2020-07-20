<template>
  <aside class="app-results-panel">
    <header class="app-results-panel__header">
      <h4 class="md-title app-results-panel__title">{{ $t('results') }}</h4>
      <md-button
        :class="{'md-primary': activePanel === 'numbers'}"
        class="md-icon-button"
        @click="setActivePanel('numbers')"
      >
        <md-icon>format_list_numbered</md-icon>
      </md-button>

      <md-button
        :class="{'md-primary': activePanel === 'bars'}"
        class="md-icon-button"
        @click="setActivePanel('bars')"
      >
        <md-icon>insert_chart</md-icon>
      </md-button>
    </header>

    <div class="app-results-panel__content">
      <slot :active="activePanel" />
    </div>

  </aside>
</template>

<script>
export default {
  data() {
    return {
      activePanel: 'numbers',
    }
  },
  methods: {
    setActivePanel(panel) {
      this.activePanel = panel
    },
  },
}
</script>

<style>
.app-results-panel {
  position: relative;
  width: var(--width-medium);
  overflow-y: auto;
  z-index: 0;
  display: flex;
  flex-direction: column;
}

.app-results-panel__header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--background-color);
  padding: var(--spacing-default);
  padding-bottom: 0;
}

.app-results-panel__header .md-button:last-child {
  margin: 0;
}

.app-results-panel__title {
  margin-right: auto;
}

.app-results-panel__content {
  z-index: 0;
  position: relative;
  padding: var(--spacing-default);
  padding-bottom: 0;
  flex: 1;
}

</style>
