<template>
  <md-drawer
    :class="{[`view-project__${drawerWidth}`]: true}"
    class="view-project"
    md-permanent="clipped">
    <button @click="togglePopup(true)">Hi my name is button</button>
    <app-popup v-if="openState" @closePopup="togglePopup(false)">
      <template v-slot:header>
        Content for the header
      </template>
      content for the main body
    </app-popup>
    <nuxt-child />
  </md-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex"
import { MeasureCard, SearchInput, AppPopup } from '~/components'
import MapEventBus, { REDRAW } from "../lib/map-event-bus"
import getViewPath from '../lib/get-view-path'

export default {
  components: { MeasureCard, SearchInput, AppPopup },
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
    ...mapGetters('popup', ['openState']),
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
    ...mapMutations({
      openPopup: 'popup/openPopup',
      closePopup: 'popup/closePopup',
    }),
    togglePopup(state) {
      state ? this.openPopup() : this.closePopup()
    },
  },
}
</script>

<style>
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
