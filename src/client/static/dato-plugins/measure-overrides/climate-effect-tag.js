const html = str => str.raw[0]; // For editor code highlight

const template = html`
<details class="climate-effect-tag" :open="value.length > 0">
  <summary><span>Climate Effect Tags</span></summary>
  <ul>
    <li v-for="item in tags" :key="item.key">
      <label>
        <input
          :ref="item.key"
          type="checkbox"
          :checked="isChecked(item.key)"
          @change="emit"
        />
        <span>{{item.title}}</span>
        <small>
          -
          original:
          <input
            type="checkbox"
            disabled
            :checked="isOrignalChecked(item.key)"
          />
        </small>
      </label>
    </li>
  </ul>
  <button v-if="value.length" class="climate-effect-tag__reset" @click="emitReset">Reset</button>
</details>
`

Vue.component('climate-effect-tag', {
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
    tags: undefined,
    originalTags: [],
  }),
  async mounted() {
    const itemTypes = await dato.itemTypes.all()
    const tagType = itemTypes.find(type => type.apiKey === 'tag')
    this.tags = await dato.items.all({ 'filter[type]': tagType.id })
      .then(tags => Promise.all(tags.map(tag =>
        dato.uploads.find(tag.icon.uploadId)
          .then(icon => ({
            key: tag.key,
            title: tag.title.en,
            icon: {
              url: icon.url,
            },
          }))
      )))
    this.originalTags = await Promise.all(this.original.map(id => dato.items.find(id)))
  },
  methods: {
    isChecked(key) {
      const isFoundInValue = this.value.find(tag => tag.key === key)
      const isFoundInOriginal = this.originalTags.find(tag => tag.key === key)

      return this.value.length > 0
        ? Boolean(isFoundInValue)
        : Boolean(isFoundInOriginal)
    },
    isOrignalChecked(key) {
      const isFoundInOriginal = this.originalTags.find(tag => tag.key === key)
      return Boolean(isFoundInOriginal)
    },
    emit() {
      const result = Object.entries(this.$refs)
        .filter(([key, [value]]) => value.checked)
        .map(([key]) => this.tags.find(tag => tag.key === key))
      this.$emit('change', result)
    },
    emitReset() {
      this.$emit('change', [])
    },
  },
  template,
})
