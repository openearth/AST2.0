<template>
  <md-list ref="list" :style="{maxHeight: maxHeight + 'px'}">
    <li
      v-for="(layer, index) in layers"
      :key="layer.id + index"
      class="md-list-item">
      <div
        :class="{ 'md-active': expanded === layer.id }"
        class="md-list-item-expand md-list-item-container"
      >
        <div class="md-list-item-content">
          <md-avatar class="layer-list__avatar">
            <img
              :src="layer.imageUrl"
              class="layer-list__avatar-img"
              alt=""
            >
          </md-avatar>

          <span class="md-list-item-text layer-list__title">{{ layer.title }}</span>

          <md-switch
            :value="!layer.visible"
            @change="value => $emit('visibility-change', { id: layer.id, value: !!value })"/>

          <md-button
            class="md-icon-button md-list-action"
            @click="setExpanded(layer.id)">
            <md-icon
              :style="{
                transform: expanded === layer.id ? 'rotate(180deg)' : 'rotate(0)'
              }"
            >keyboard_arrow_down</md-icon>
          </md-button>
        </div>

        <div
          :style="{height: expanded === layer.id ? 'auto' : '0px'}"
          class="md-list-expand">
          <md-list>
            <md-list-item class="md-inset">
              <input-range
                :value="String(layer.opacity * 100)"
                class="layer-list__input-range"
                min="0"
                max="100"
                label="opacity"
                @change="value => $emit('opacity-change', { id: layer.id, value: parseFloat(value / 100) })"/>
            </md-list-item>
            <md-list-item v-if="layer.legendUrl" class="md-inset">
              legend
              <md-switch
                :value="!layer.showLegend"
                @change="value => $emit('legend-visibility-change', { id: layer.id, value: !!value })"/>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </li>
    <div class="layer-list__footer">
      <md-button class="layer-list__add-btn" @click="showLayerDialog = true">
        <md-icon>add</md-icon>
        <span class="md-list-item-text">{{ $t('add_layers') }}</span>
      </md-button>
      <layer-dialog :show-layer-dialog.sync="showLayerDialog"/>
    </div>
  </md-list>
</template>

<script>
import InputRange from "../input-range";
import LayerDialog from "../layer-dialog";

export default {
  components: { InputRange, LayerDialog },
  props: {
    layers: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    expanded: '',
    showLayerDialog: false,
    maxHeight: 500,
  }),
  mounted() {
    this.calculateMaxHeight();
  },
  methods: {
    setExpanded(id) {
      this.expanded = this.expanded !== id ? id : ''
    },
    calculateMaxHeight() {
      /**
       * calculating possible max-height
       * magic numbers: 300 as distance to top, 80 as spacing at bottom
       */
      // TODO/Extra: Add resize handler to recalculate maxHeight
      const top = this.$refs.list ? this.$refs.list.$el.getBoundingClientRect().top : 300;
      this.maxHeight = (window.innerHeight - top - 80)
    },
  },
}
</script>

<style>
.layer-list__title {
  margin-right: var(--spacing-double);
}

.layer-list__input-range {
  width: 100%;
}

.layer-list__avatar {
  background-color: var(--neutral-color--light);
}

.layer-list__avatar-img:not([src]) {
  display: none;
}

.layer-list__footer {
  position: sticky;
  bottom: 0;
  left: 0;
  z-index: 10;
  background-color: var(--background-color);
  box-shadow: var(--shadow-small-grey);
}

.layer-list__add-btn {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
}

.layer-list__add-btn .md-ripple {
  padding: 12px 16px 12px 24px;
}

.layer-list__add-btn .md-button-content {
  width: 100%;
  display: flex;
  align-items: center;
}

.layer-list__add-btn .md-list-item-text {
  margin-left: 23px;
}

</style>
