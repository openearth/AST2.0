<template>
  <transition name="slide-up">
    <div v-if="inputElementRef" class="virtual-keyboard">
      <div class="virtual-keyboard__wrapper">
        <md-field
          v-if="inputElementRef.dataset.type !== 'number'"
          class="virtual-keyboard__input md-theme-default md-focused"
        >
          <label>{{ label }}</label>
          <md-input :value="value" />
          <div class="virtual-keyboard__input-overlay" />
        </md-field>
        <div class="virtual-keyboard__input">
          <numeric-input
            v-if="inputElementRef.dataset.type === 'number'"
            :label="label"
            :value="value"
            class="md-focused"
          />
          <div class="virtual-keyboard__input-overlay" />
        </div>
        <vue-touch-keyboard
          :layout="layout"
          :cancel="hide"
          :accept="accept"
          :input="inputElementRef"
          :change="change"
        />
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { numericLayout, textLayout } from '../../assets/custom-keyboard-options';
  import NumericInput from '../numeric-input'

  export default {
    components: { NumericInput },

    data: function() {
      return {
        value: '',
        layout: textLayout,
        input: null,
        options: {
          useKbEvents: false,
          preventClickEvent: false,
        },
      };
    },

    computed: {
      ...mapState('focusedInput', ['inputElement', 'onChange', 'label']),
      inputElementRef() {
        return this.inputElement
          ? document.querySelector(`#${this.inputElement}`)
          : null
      },
    },
    watch: {
      inputElement(newValue) {
        if (newValue) {
          this.visible = true
          this.value = this.inputElementRef.value
          this.layout = this.inputElementRef.dataset.type === 'number' ? numericLayout : textLayout
        }
      },
    },
    methods: {
      ...mapMutations({
        setFocusedInput: 'focusedInput/setFocusedInput',
        removeFocusedInput: 'focusedInput/removeFocusedInput',
      }),
      accept() {
        this.removeFocusedInput()
        this.hide()
      },

      show() {
        if (!this.visible)
          this.visible = true
      },

      hide() {
        this.visible = false;
      },
      change(value) {
        this.value = value
        this.onChange(value)
      },
    },
  }
</script>

<style>
.virtual-keyboard {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .25)
}

.virtual-keyboard__wrapper {
  width: 50%;
  background-color: #FAFAFA;
  padding: 3rem;
  border-radius: 5px;
}

.virtual-keyboard__input {
  position: relative;
}

.virtual-keyboard__input-overlay {
  position: absolute;
  background-color: transparent;
  width: 100%;
  height: 100%;
  top: 0;
}
</style>
