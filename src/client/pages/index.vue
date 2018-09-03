<template>
  <div>
    <h1>Home</h1>
    <p>Project: <input v-model="projectTitle" >: {{ projectTitle }}</p>
    <ul>
      <li><nuxt-link to="/en/about">about</nuxt-link></li>
      <li><project-export :is-client="isClient" :project="project"/></li>
      <li><project-import @load="onImport"/></li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { ProjectExport, ProjectImport } from "../components";

export default {
  components: { ProjectExport, ProjectImport },
  data: () => ({
    isClient: false,
  }),
  computed: {
    ...mapState(['project']),
    projectTitle: {
      get() {return this.$store.state.project.settings.title},
      set(value) {  this.$store.commit('project/setTitle', value)},
    },
  },
  mounted() {
    this.isClient = true
  },
  methods: {
    ...mapMutations({ import: 'project/import' }),
    onImport(projectFile) {
      this.import(projectFile)
    },
  },
}
</script>
