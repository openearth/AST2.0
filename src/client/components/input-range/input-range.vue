<template>
  <div class="input-range">
    <span v-if="label !== ''" class="input-range__label">{{ label }}</span>
    <div class="input-range__value-wrapper">
      <input
        :value="value"
        :min="min"
        :max="max"
        class="input-range__range"
        type="range"
        v-on="inputListeners">
      <md-field class="input-range__number">
        <md-input
          :value="value"
          type="number"
          v-on="inputListeners"/>
      </md-field>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: String,
      default: "0",
    },
    max: {
      type: String,
      default: "1",
    },
  },
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` merges objects together to form a new object
      return Object.assign({},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: function (event) {
            vm.$emit('input', event.target ? event.target.value : event )
          },
          change: function (event) {
            vm.$emit('change', event.target ? event.target.value : event )
          },
        }
      )
    },
  },
}
</script>


<style>
.input-range {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-range:focus-within .input-range__label {
  color: var(--md-theme-default-primary);
}

.input-range__label {
  font-size: 12px;
  color: rgba(0,0,0,0.54);
  position: absolute;
}

.input-range__value-wrapper {
  display: flex;
  align-items: center;
}

.input-range__range {
  flex: 1;
  margin-right: 1rem;
}

.input-range__number {
  width: 3rem;
  position: relative
}

.input-range__number .md-input {
  width: 100%;
  text-align: center;
  position: absolute;
  width: 100%;
}
</style>
