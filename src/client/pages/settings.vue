<template>
  <div class="settings">
    <header class="settings__header">
      <h2>Settings</h2>
      <nav>
        <ul>
          <li><nuxt-link to="/en/settings/project-area">Project area</nuxt-link></li>
          <li><nuxt-link to="/en/settings/general">General</nuxt-link></li>
        </ul>
      </nav>
    </header>

    <nuxt-child />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      projectSettings: state => state.project.settings,
    }),
    projectArea() { return this.projectSettings.projectArea.properties.area.toFixed(2) },
  },
}
</script>

<style>
.settings {
  width: 700px;
}

.settings__header {
  height: 100px;
}
</style>
