<template>
  <div class="page-index">
    <h2 class="md-headline">
      {{ $t('welcome') }}
    </h2>
    <p class="md-body-1 page-index__intro">
      {{ $t('welcome_intro') }}
    </p>

    <div class="page-index__actions">
      <md-button
        :to="`/${locale}/new-project/`"
        :disabled="!acceptedLegal"
        class="page-index__action-btn md-raised"
      >
        {{ $t('start_new_project') }}
      </md-button>
      <div class="page-index__divider" />
      <div class="page-index__import-button-wrapper">
        <md-button
          :disabled="!acceptedLegal"
          class="page-index__action-btn md-raised"
        >
          {{ $t('import_exisiting_project') }}
        </md-button>
        <input
          class="page-index__input-file"
          type="file"
          accept="application/json"
          @change="onFileInput"
        >
      </div>

      <div class="page-index__docs-button-wrapper">
        <md-button
          :to="`/${$i18n.locale}/documentation/`"
          :disabled="!acceptedLegal"
          class="md-raised page-index__docs-button"
        >
          {{ $t('documentation') }}
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import MapEventBus, { REDRAW } from '../lib/map-event-bus'
import log from '../lib/log'

export default {
  middleware: ['state-is-modal'],
  computed: {
    ...mapState('i18n', ['locale']),
    ...mapGetters('flow', ['acceptedLegal', 'currentFilledInLevel']),
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
  methods: {
    ...mapActions({
      importProject: 'project/importProject',
      showError: 'notifications/showError',
    }),
    async onFileInput(event) {
      this.importProject(event)
        .then(() => this.$router.push(this.currentFilledInLevel.uri))
        .catch(error => {
          if (error.name !== 'NavigationDuplicated') {
            log.error('Could not load file', error);
            this.showError({ message: this.$i18n.t('could_not_load_file') })
          }
        })
    },
  },
}
</script>

<style>
.page-index {
  max-width: 60ch;
}

.page-index__actions {
  display: flex;
  margin-top: var(--spacing-default);
}

.page-index__divider {
  width: 1px;
  height: 50px;
  background-color: lightgrey;
  flex: 1;
}

.page-index__import-button-wrapper {
  display: flex;
  position: relative;
  z-index: 0;
}

.page-index__import-button-wrapper > * {
  flex: 1;
  z-index: 0;
}

.page-index__action-btn {
  background-color: var(--action-color) !important;
}

.page-index__input-file {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
}

.page-index__input-file:hover {
  cursor: pointer;
}

.page-index__docs-button-wrapper {
  grid-column: span 3;
  margin-top: var(--spacing-default);
  padding-right: 8px;
  padding-left: 8px;
  text-align: center;
}

.page-index__docs-button {
  width: 100%;
  margin-right: 0;
  margin-left: 0;
}

@supports (display: grid) {
  .page-index__actions {
    display: grid;
    grid-column-gap: var(--spacing-default);
    grid-template-columns: 1fr 1px 1fr;
  }
}
</style>
