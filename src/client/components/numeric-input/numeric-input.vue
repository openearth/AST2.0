<template>
  <md-field class="numeric-input">
    <label v-if="!hideLabel">{{ label }}</label>
    <md-input
      ref="inputElement"
      :value="value"
      type="number"
      @change="event => onChange(event.target.value)"
      @input="value => onChange(value)"
    />

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
