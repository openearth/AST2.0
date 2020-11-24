<template>
  <aside class="app-results-panel">
    <header class="app-results-panel__header">
      <h4 class="md-title app-results-panel__title">
        {{ $t('results') }}
      </h4>

      <md-button
        v-for="button in nonEmptyButtonList"
        :key="button.id"
        :class="{[`app-results-panel__button--active`]: activePanel === button.id}"
        :style="`--button-color: var(${button.color || '--md-theme-default-accent'})`"
        class="md-icon-button"
        @click="setActivePanel(button.id)"
      >
        <md-icon>{{ button.icon }}</md-icon>
      </md-button>
    </header>

    <div class="app-results-panel__content">
      <slot :active="activePanel" />
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    buttons: {
      type: Array,
      default: () => [],
      validator: list => list
        .filter(x => x)
        .every(item => typeof item.id == 'string' && typeof item.icon == 'string'),
    },
    defaultActive: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activePanel: '',
    }
  },
  computed: {
    nonEmptyButtonList() {
      return this.buttons.filter(x => x)
    },
  },
  created() {
    this.activePanel = this.defaultActive
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

.app-results-panel__button--active.md-button.md-theme-default,
.app-results-panel__button--active .md-icon.md-theme-default.md-icon-font {
  color: var(--button-color);
}

</style>
