<template>
  <div class="page-index">
    <h2 class="md-headline">{{ $t('welcome') }}</h2>
    <p class="md-body-1 page-index__intro">{{ $t('welcome_intro') }}</p>

    <div class="page-index__actions">
      <md-button :to="`/${locale}/new-project/`" class="md-raised md-primary">
        {{ $t('start_new_project') }}
      </md-button>
      <div class="page-index__divider" />
      <md-button class="md-raised md-primary">
        {{ $t('import_exisiting_project') }}
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MapEventBus, { REDRAW } from "../lib/map-event-bus"

export default {
  layout: 'modal',
  computed: {
    ...mapState('i18n', ['locale']),
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
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

@supports (display: grid) {
  .page-index__actions {
    display: grid;
    grid-column-gap: var(--spacing-default);
    grid-template-columns: 1fr 1px 1fr;
  }
}
</style>
