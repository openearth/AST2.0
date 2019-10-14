const html = str => str.raw[0]; // For editor code highlight

const template = html`
<details class="image-gallery" :open="images.length">
  <summary><span>Gallery Images</span></summary>
  <ul class="image-gallery__original-list">
    <li
      class="image-gallery__original-item"
      v-for="item in originalImages"
      :key="item.url"
      :class="{'image-gallery__original-item--ignored': isIgnored(item)}" >
      <button @click="toggleOriginalIgnore(item)">
        <img :src="item" />
      </button>
    </li>
  </ul>

  <upload-image
    class="image-gallery__upload-image"
    v-for="(item, index) in images"
    :key="index" :value="item.image"
    @change="image => item.image = image || {}"
  >
    <label class="image-gallery__input-wrapper">
      <span class="image-gallery__input-label">Title:</span>
      <input type="text" v-model="item.title"/>
    </label>
  </upload-image>
  <button class="DatoCMS-button" @click="addImage">Add image</button>
</details>
`

Vue.component('image-gallery', {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    original: {
      type: Array,
      default: () => [],
    },
    originalIgnores: {
      type: Array,
      default: () => ([]),
    },
  },
  data: () => ({
    images: [],
    originalImages: [],
  }),
  watch: {
    'images': {
      handler() {
        const storable = this.images.filter(({ image }) => image && image.url)
        this.$emit('change', storable)
      },
      deep: true,
    },
  },
  mounted() {
    this.value.forEach(item => this.images.push(item))
    this.original.forEach(async id => {
      const genericImage = await dato.items.find(id)
      const image = await dato.uploads.find(genericImage.image)
      this.originalImages.push(image.url)
    })
  },
  methods: {
    addImage() {
      this.images.push({ image: {}, title: '' })
    },
    toggleOriginalIgnore(url) {
      const item = this.originalIgnores.find(item => item.url === url)

      const newArr = item
        ? this.originalIgnores.filter(org => org !== item)
        : [...this.originalIgnores, { url, ignore: true }]

      this.$emit('ignores', newArr)
    },
    isIgnored(url) {
      const item = this.originalIgnores.find(org => org.url === url)
      return item && item.ignore
    },
  },
  template,
})
