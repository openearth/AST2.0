<template>
  <md-drawer md-permanent="clipped" class="legal">
    <div class="new-project__content">
      <h1>Terms and conditions</h1>
    </div>
  </md-drawer>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MapEventBus, { REDRAW } from "../lib/map-event-bus"

export default {
  computed: {
    ...mapState('i18n', ['locale']),
    ...mapState('project', ['settings']),
    ...mapGetters('flow', ['createdProjectArea']),
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
}
</script>

<style>
.new-project {
  display: flex;
  flex-direction: column;
}

.new-project__content {
  flex: 1;
  overflow-y: scroll;
}

.new-project__action-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
