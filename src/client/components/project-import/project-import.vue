<template>
  <input type="file" @change="onUpload"/>
</template>

<script>
export default {
  methods: {
    onUpload(event) {
      const [file] = event.target.files
      const reader = new FileReader()

      reader.addEventListener('load', event => {
        this.$emit('load', JSON.parse(event.target.result))
      })

      reader.readAsText(file)
    }
  }
}
</script>
