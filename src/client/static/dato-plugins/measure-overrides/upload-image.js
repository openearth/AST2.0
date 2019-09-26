const html = str => str.raw[0]; // For editor code highlight

const template = html`
<div class="upload-image">
  <div>
    <img v-if="image" class="upload-image__uploaded-img" :src="image.url" />
  </div>
  <slot />
  <button v-if="image" class="DatoCMS-button--alert" @click="handleRemove">Remove</button>
  <div class="upload-image__upload-wrapper" v-if="!image">
    <button class="DatoCMS-button">Upload</button>
    <input class="upload-image__upload-trigger" type="file" @change="handleFileInput"/>
  </div>
</div>
`

Vue.component('upload-image', {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    uploadId: undefined,
    image: undefined,
  }),
  watch: {
    async uploadId(value) {
      const image = await dato.uploads.find(value)
      if (image) {
        this.setImage(image)
        this.$nextTick(() => {
          this.$emit('change', this.image)
        })
      }
    },
  },
  mounted() {
    if (this.value.url) {
      this.setImage(this.value)
    }
  },
  methods: {
    async handleFileInput(event) {
      if (event.target.files[0]) {
        await dato.uploadFile(event.target.files[0])
          .then(uploadId => this.uploadId = uploadId)
          .catch(error => console.log(error))
      }
    },
    handleRemove() {
      this.image = undefined
      this.$emit('change', undefined)
    },
    setImage(image) {
      this.image = {
        width: image.width,
        height: image.height,
        format: image.format,
        url: image.url,
      }
    },
    getImage() {
      return this.image
    },
  },
  template,
})
