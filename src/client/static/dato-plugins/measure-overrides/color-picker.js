const html = str => str.raw[0]; // For editor code highlight

const template = html`
<details class="color-picker" :open="value">
  <summary><span>Color</span></summary>
  <input ref="input" class="color-picker__trigger" type="color" @change="emit" :value="value || orgHex"/>
  <button class="color-picker__reset" @click="reset">Reset</button>
</details>
`

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

Vue.component('color-picker', {
  props: {
    value: {
      type: String,
      default: undefined,
    },
    original: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    orgHex() {
      const r = this.original.color.red
      const g = this.original.color.green
      const b = this.original.color.blue
      return r || g || b
        ? rgbToHex(r, g, b)
        : ''
    },
  },
  methods: {
    emit(event) {
      this.$emit('change', { hex: event.target.value })
    },
    reset() {
      this.$emit('change', '')
      this.$refs.input.value = this.orgHex
    },
  },
  template,
})
