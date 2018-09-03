<template>
  <a :href="projectBlob" download="project.json">Project export</a>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
    isClient: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    projectBlob() {
      if (this.isClient) {
        const blob = new Blob([JSON.stringify(this.project, null, 2)], {type: 'application/json'})
        return URL.createObjectURL(blob)
      } else {
        return ''
      }
    },
  },
  methods: {
  },
}
</script>
