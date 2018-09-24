<template>
  <transition name="slide-up">
    <div v-if="inputElementRef" class="virtual-keyboard">
      <div class="virtual-keyboard__wrapper">
        <md-field class="md-theme-default md-focused">
          <label>{{ label }}</label>
          <md-input :value="value" />
        </md-field>
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
  import { mapState, mapMutations } from "vuex";
  import { numericLayout } from "../../assets/custom-keyboard-options";

  export default {
    data: function() {
      return {
        value: '',
        layout: "normal",
        input: null,
        options: {
          useKbEvents: true,
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
          this.layout = this.inputElementRef.type === 'number' ? numericLayout : 'normal'
        }
      },
    },
    methods: {
      ...mapMutations({
        setFocusedInput: 'focusedInput/setFocusedInput',
        removeFocusedInput: 'focusedInput/removeFocusedInput',
      }),
      accept(text) {
        this.removeFocusedInput()
        this.hide()
      },

      show(e) {
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
</style>
