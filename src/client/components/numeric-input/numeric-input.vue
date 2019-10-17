<template>
  <md-field :class="{'md-invalid': error}" class="numeric-input">
    <label v-if="!hideLabel">{{ label }}</label>
    <md-input
      ref="inputElement"
      :value="value"
      data-type="number"
      @change="event => validateNumber(event.target.value)"
      @input="value => validateNumber(value)"
    />
    <span class="md-error">{{ $t('input_should_be_number') }}</span>

    <slot />

    <div
      v-if="forceKeyboard"
      class="numeric-input__click-highjack"
      @click="onFocus" />

    <md-button
      v-if="!forceKeyboard"
      class="md-icon-button md-dense"
      @click="onFocus">
      <md-icon>keyboard</md-icon>
    </md-button>
  </md-field>
</template>

<script>
import { mapMutations } from "vuex";
import isValidNumber from '../../lib/is-valid-number'

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
  },
  computed: {
    error() {
      return !isValidNumber(this.value)
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
      const input = _input.replace(',', '.')
      this.onChange(input)
    },
  },
}
</script>

<style>
.numeric-input {
  position: relativ;
}

.numeric-input__click-highjack {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
