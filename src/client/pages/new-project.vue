<template>
  <md-drawer md-permanent="clipped">
    <div>
      <h1>Home</h1>
      <p>Project: <input v-model="projectTitle" >: {{ projectTitle }}</p>
      <ul>
        <li><nuxt-link to="/en/about">about</nuxt-link></li>
        <li><project-export :is-client="isClient" :project="project"/></li>
        <li><project-import @load="onImport"/></li>
      </ul>
    </div>
  </md-drawer>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { ProjectExport, ProjectImport } from "../components";
import MapEventBus, { REDRAW } from "../lib/map-event-bus";

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
    MapEventBus.$emit(REDRAW)
  },
  methods: {
    ...mapMutations({ import: 'project/import' }),
    onImport(projectFile) {
      this.import(projectFile)
    },
  },
}
</script>
