<template>
  <div class="project-area">
    <h2 class="project-area__title">{{ $t('project_area') }}</h2>
    <div v-if="area">{{ area }}m2</div>
    
    <form class="project-area__form" @submit="onSubmit">
      <fieldset 
        v-for="setting in areaSettings" 
        :key="setting.key" 
        class="project-area__input-group">
        
        <legend class="project-area__input-group__legend">{{ setting.title }}</legend>
        
        <label 
          v-for="option in setting.options" 
          :key="option.value" 
          class="project-area__input-group__label">
          
          <input
            :id="option.value"
            :name="setting.key"
            :type="setting.multiple ? 'checkbox' : 'radio'"
            class="project-area__input-group__input">
          
          {{ option.title }}
        </label>
      </fieldset>
    </form>
    <pre>{{ areaSettings }}</pre>
  </div>   
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      projectArea: state => state.project.settings.projectArea,
      areaSettings: state => state.data.areaSettings,
    }),
    area() { return this.projectArea.properties && this.projectArea.properties.area.toFixed(2) },
  },
  methods: {
    onSubmit() {
      // TODO handle submit
    },
  },
}
</script>

<style>
.project-area {
  max-width: 100%;
}
</style>
