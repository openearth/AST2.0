const html = str => str.raw[0]; // For editor code highlight

const template = html`
<details class="default-values" :open="getResult()">
  <summary><span>Default values</span></summary>

  <details class="default-value" :open="isNotEmptyObject(depth)">
    <summary><span>Depth</span></summary>
    <div class="default-value__content">
      <label>
        <span>Min ({{originals.Depth && originals.Depth.min}})</span>
        <input type="number" step="any" :value="depth.min" @change="emit" ref="depthMin"/>
      </label>
      <label>
        <span>Max ({{originals.Depth && originals.Depth.max}})</span>
        <input type="number" step="any" :value="depth.max" @change="emit" ref="depthMax"/>
      </label>
      <label>
        <span>Value ({{originals.Depth && originals.Depth.value}})</span>
        <input type="number" step="any" :value="depth.value" @change="emit" ref="depthValue"/>
      </label>
  </div>
  </details>

  <details class="default-value" :open="isNotEmptyObject(inflow)">
    <summary><span>Inflow</span></summary>
    <div class="default-value__content">
      <label>
        <span>Min ({{originals.Inflow && originals.Inflow.min}})</span>
        <input type="number" step="any" :value="inflow.min" @change="emit" ref="inflowMin"/>
      </label>
      <label>
        <span>Max ({{originals.Inflow && originals.Inflow.max}})</span>
        <input type="number" step="any" :value="inflow.max" @change="emit" ref="inflowMax"/>
      </label>
      <label>
        <span>Value ({{originals.Inflow && originals.Inflow.value}})</span>
        <input type="number" step="any" :value="inflow.value" @change="emit" ref="inflowValue"/>
      </label>
    </div>
  </details>

  <details class="default-value" :open="isNotEmptyObject(width)">
    <summary><span>Width</span></summary>
    <div class="default-value__content">
      <label>
        <span>Min ({{originals.Width && originals.Width.min}})</span>
        <input type="number" step="any" :value="width.min" @change="emit" ref="widthMin"/>
      </label>
      <label>
        <span>Max ({{originals.Width && originals.Width.max}})</span>
        <input type="number" step="any" :value="width.max" @change="emit" ref="widthMax"/>
      </label>
      <label>
        <span>Value ({{originals.Width && originals.Width.value}})</span>
        <input type="number" step="any" :value="width.value" @change="emit" ref="widthValue"/>
      </label>
    </div>
  </details>

  <details class="default-value" :open="isNotEmptyObject(radius)">
    <summary><span>Radius</span></summary>
    <div class="default-value__content">
      <label>
        <span>Min ({{originals.Radius && originals.Radius.min}})</span>
        <input type="number" step="any" :value="radius.min" @change="emit" ref="radiusMin"/>
      </label>
      <label>
        <span>Max ({{originals.Radius && originals.Radius.max}})</span>
        <input type="number" step="any" :value="radius.max" @change="emit" ref="radiusMax"/>
      </label>
      <label>
        <span>Value ({{originals.Radius && originals.Radius.value}})</span>
        <input type="number" step="any" :value="radius.value" @change="emit" ref="radiusValue"/>
      </label>
    </div>
  </details>

</details>
`

Vue.component('default-values', {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    original: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    org: [],
  }),
  computed: {
    depth() {
      const obj = [...this.value].find(obj => obj.key === 'Depth')
      return obj || {}
    },
    inflow() {
      const obj = [...this.value].find(obj => obj.key === 'Inflow')
      return obj || {}
    },
    width() {
      const obj = [...this.value].find(obj => obj.key === 'Width')
      return obj || {}
    },
    radius() {
      const obj = [...this.value].find(obj => obj.key === 'Radius')
      return obj || {}
    },
    originals() {
      return this.org.reduce((obj, item) => {
        obj[item.title] = item
        return obj
      }, {})
    },
  },
  async mounted() {
    const promises =  this.original.map(item =>
      dato.items.find(item)
    )
    this.org = await Promise.all(promises)
  },
  methods: {
    isNotEmptyObject(obj) {
      return Object.keys(obj).length !== 0
    },
    emit() {
      this.$emit('change', this.getResult())
    },
    getResult() {
      const depth = {}
      const inflow = {}
      const width = {}
      const radius = {}
      const returnValue = []

      if (this.$refs.depthMin && this.$refs.depthMax && this.$refs.depthValue) {
        if (this.$refs.depthMin.value !== '')
          depth.min = Number(this.$refs.depthMin.value)
        if (this.$refs.depthMax.value !== '')
          depth.max = Number(this.$refs.depthMax.value)
        if (this.$refs.depthValue.value !== '')
          depth.value = Number(this.$refs.depthValue.value)
        if (Object.keys(depth).length > 0) {
          depth.key = 'Depth'
          returnValue.push(depth)
        }
      }

      if (this.$refs.inflowMin && this.$refs.inflowMax && this.$refs.inflowValue) {
        if (this.$refs.inflowMin.value !== '')
          inflow.min = Number(this.$refs.inflowMin.value)
        if (this.$refs.inflowMax.value !== '')
          inflow.max = Number(this.$refs.inflowMax.value)
        if (this.$refs.inflowValue.value !== '')
          inflow.value = Number(this.$refs.inflowValue.value)
        if (Object.keys(inflow).length > 0) {
          inflow.key = 'Inflow'
          returnValue.push(inflow)
        }
      }

      if (this.$refs.inflowMin && this.$refs.inflowMax && this.$refs.inflowValue) {
        if (this.$refs.radiusMin.value !== '')
          radius.min = Number(this.$refs.radiusMin.value)
        if (this.$refs.radiusMax.value !== '')
          radius.max = Number(this.$refs.radiusMax.value)
        if (this.$refs.radiusValue.value !== '')
          radius.value = Number(this.$refs.radiusValue.value)
        if (Object.keys(radius).length > 0) {
          radius.key = 'Radius'
          returnValue.push(radius)
        }
      }

      if (this.$refs.widthMin && this.$refs.widthMax && this.$refs.widthValue) {
        if (this.$refs.widthMin.value !== '')
          width.min = Number(this.$refs.widthMin.value)
        if (this.$refs.widthMax.value !== '')
          width.max = Number(this.$refs.widthMax.value)
        if (this.$refs.widthValue.value !== '')
          width.value = Number(this.$refs.widthValue.value)
        if (Object.keys(width).length > 0) {
          width.key = 'Width'
          returnValue.push(width)
        }
      }

      if (returnValue.length) {
        return this.org.map(
          ({ min, max, value, title }) => _.merge(
            { min, max, value, key: title },
            _.find(returnValue, item => item.key === title) || {},
          )
        )
      }
    },
  },
  template,
})
