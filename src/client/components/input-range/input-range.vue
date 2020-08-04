<template>
  <div class="input-range">
    <label
      v-if="label !== ''"
      :for="label"
      class="input-range__label"
    >
      {{ label }}
      <slot name="info" />
    </label>
    <div class="input-range__value-wrapper">
      <input
        :value="value"
        :min="floatMin"
        :max="max"
        :step="steps"
        :name="label"
        class="input-range__range"
        type="range"
        v-on="inputListeners"
      >
      <numeric-input
        v-if="numericEnabled"
        :label="label"
        :value="stringValue"
        :on-change="value => $emit('change', isNaN(value) ? null : value)"
        class="input-range__number"
        hide-label
      />
      <div v-else class="md-field numeric-input input-range__number md-theme-default md-has-value">
        <span class="md-input">{{ Math.floor(value) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import NumericInput from '../numeric-input';

export default {
  components: { NumericInput },
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    min: {
      type: String,
      default: '0',
    },
    max: {
      type: String,
      default: '1',
    },
    numericEnabled: {
      type: Boolean,
      default: true,
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
        },
      )
    },
    stringValue () {
      return String(this.value === null ? '' : this.value)
    },
    floatMin() {
      return /\./.test(String(this.min)) ? this.min : `${this.min}.0`
    },
    steps() {
      const max = parseFloat(this.max)
      if (max <= 1) {
        return '0.01'
      } else if (max <= 10) {
        return '0.1'
      } else {
        return '1'
      }
    },
  },
}
</script>


<style>
.input-range {
  position: relative;
  display: flex;
  flex-direction: column;
}

.input-range:focus-within .input-range__label {
  color: var(--md-theme-default-primary);
}

.input-range__label {
  position: absolute;
  font-size: var(--font-size-extra-small);
  color: rgba(0,0,0,0.54);
}

.input-range__value-wrapper {
  display: flex;
  align-items: baseline;
}

.input-range__range {
  flex: 1;
  margin-right: var(--spacing-default);
}

.input-range__number {
  width: 6rem;
  position: relative;
}

.input-range__number .md-input {
  width: 100%;
  text-align: center;
  min-width: 0;
}

/* target (old) edge only */
@supports (-ms-ime-align:auto) {
    .input-range__value-wrapper {
        align-items: center;
    }
    .input-range__range {
      margin-top: 25px;
    }
}

</style>
