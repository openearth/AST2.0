<template>
  <md-list>
    <li
      v-for="layer in layers"
      :key="layer.id"
      class="md-list-item">
      <div
        :class="{ 'md-active': expanded === layer.id }"
        class="md-list-item-expand md-list-item-container"
      >
        <div class="md-list-item-content">
          <md-avatar>
            <img src="https://placehold.it/40" alt="">
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
          </md-list>
        </div>
      </div>
    </li>
  </md-list>
</template>

<script>
import InputRange from "../input-range";

export default {
  components: { InputRange },
  props: {
    layers: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    expanded: '',
  }),
  methods: {
    setExpanded(id) {
      this.expanded = this.expanded !== id ? id : ''
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
</style>
