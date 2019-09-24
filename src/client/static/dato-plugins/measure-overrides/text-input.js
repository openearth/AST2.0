const html = str => str.raw[0]; // For editor code highlight

const template = html`
<label>
  <details :open="value !== ''">
    <summary><span>{{summary}}</span></summary>
    <small v-if="original.en">Original value: {{original.en}}</small>
    <input
      v-if="inputType === 'text'"
      type="text"
      :value="value"
      v-on="$listeners"
    />
    <textarea
      v-if="inputType === 'textarea'"
      :value="value"
      v-on="$listeners"
    ></textarea>
  </details>
</label>
`

Vue.component('text-input', {
  props: {
    value: {
      type: String,
      default: '',
    },
    inputType: {
      type: String,
      default: 'text',
    },
    summary: {
      type: String,
      default: '',
    },
    original: {
      type: Object,
      default: () => ({}),
    },
  },
  template,
})
