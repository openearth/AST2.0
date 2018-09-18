<template>
  <div class="touch-keyboard">
    <vue-touch-keyboard
      :visible="visible"
      :layout="numericLayout"
      :input="input"
      :cancel="() => this.$emit('cancel')"
      :accept="() => this.$emit('accept')"
      class="custom-keyboard" />
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations, mapActions } from "vuex";
import { numericLayout } from '~/assets/custom-keyboard-layout'

export default {
  props: ['visible', 'input'],
  data() {
    return {
      options: {
        useKbEvents: false,
        preventClickEvent: false,
      },
      numericLayout,
    }
  },
  methods: {
    accept(text) {
      console.log(text)
      this.hide();
    },
    show(e) {
      this.input = e.target;

      if (!this.visible)
        this.visible = true
    },
    hide() {
      this.visible = false;
    },
  },
}
</script>

<style>
.vue-touch-keyboard.custom-keyboard {
  width: 450px;
  padding: 1rem;
  background-color: #fafafa;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.touch-keyboard {
  position: absolute;
  bottom: 0;
  left: calc(50% - 225px);
  z-index: var(--layer--popup);
}
</style>
