<template>
  <md-drawer
    :class="{[`view-project__${drawerWidth}`]: true}"
    class="view-project"
    md-permanent="clipped">
    <nuxt-child />
  </md-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { MeasureCard, SearchInput } from '~/components'
import MapEventBus, { REDRAW } from "../lib/map-event-bus"
import getViewPath from '../lib/get-view-path'

export default {
  components: { MeasureCard, SearchInput },
  middleware: ['state-is-default'],
  data() {
    return {
      isAreasListVisible: false,
      isAreaVisible: true,
      largeViews: ['measures'],
      extraLargeViews: [],
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapState('project', ['areas']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('project', ['areasByMeasure', 'measureCollection']),
    drawerWidth() {
      const [view, parentView] = getViewPath(this.$route).reversedPath
      const isLarge = this.largeViews.indexOf(view) !== -1 || this.largeViews.indexOf(parentView) !== -1
      const isExtraLarge = this.extraLargeViews.indexOf(view) !== -1 || this.extraLargeViews.indexOf(parentView) !== -1
      let viewWidth = 'medium'

      viewWidth = isExtraLarge ? 'extra-large' : viewWidth
      viewWidth = isLarge ? 'large' : viewWidth

      return viewWidth
    },
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
  methods: {
    ...mapActions({ updateAreaProperties: 'project/updateAreaProperties' }),
  },
}
</script>

<style>
.view-project {
  display: flex;
  flex-direction: column;
}

.view-project__medium {
  width: var(--width-medium);
}
.view-project__large {
  width: var(--width-large);
}
.view-project__extra-large {
  width: var(--width-extra-large);
}
</style>
