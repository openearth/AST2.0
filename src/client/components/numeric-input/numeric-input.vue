<template>
  <md-field :class="{'md-invalid': error}" class="numeric-input">
    <label v-if="!hideLabel">{{ label }}</label>
    <md-input
      ref="inputElement"
      :value="convertedValue"
      data-type="number"
      :placeholder="multi ? $t('multi') : ''"
      @change="event => validateNumber(event.target.value)"
      @input="value => validateNumber(value)"
    />
    <span class="md-error">{{ $t('input_should_be_number') }}</span>

    <slot />

    <div
      v-if="forceKeyboard"
      class="numeric-input__click-highjack"
      @click="onFocus"
    />

    <md-button
      v-if="!forceKeyboard"
      class="md-icon-button md-dense"
      @click="onFocus"
    >
      <md-icon>keyboard</md-icon>
    </md-button>
  </md-field>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import isValidNumber from '../../lib/is-valid-number'
import convertToMetric from '../../components/unit-output/convert-to-metric'
import convertToImperial from '../../components/unit-output/convert-to-imperial'

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    onChange: {
      type: Function,
      default: () => {},
    },
    forceKeyboard: {
      type: Boolean,
      default: false,
    },
    hideLabel: {
      type: Boolean,
      default: false,
    },
    multi: {
      type: Boolean,
      default: false,
    },
    unit: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    ...mapGetters('data/workspaces', ['activeWorkspace']),
    hasEmptyInput() {
      return this.value === ''
    },
    error() {
      return !this.hasEmptyInput && !isValidNumber(this.value)
    },
    convertedValue() {
      return this.activeWorkspace.unitSystem === 'imperial'
        ?`${convertToImperial(this.value, this.unit)}`
        : this.value
    },
  },
  methods: {
    ...mapMutations({
      setFocusedInput: 'focusedInput/setFocusedInput',
    }),
    onFocus() {
      this.setFocusedInput({
        inputElementId: this.$refs.inputElement.id,
        onChange: this.onChange,
        label: this.label,
      })
      this.$refs.inputElement.$el.focus()
    },
    validateNumber(_input) {
      const num = this.activeWorkspace.unitSystem === 'imperial'
        ? `${convertToMetric(_input, this.unit)}`
        : _input

      const input = num.replace(',', '.')
      this.onChange(input)
    },
  },
}
</script>

<style>
.numeric-input {
  position: relatie;
}

.numeric-input__click-highjack {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
