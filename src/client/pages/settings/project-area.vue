<template>
  <div class="project-area">
    <div class="project-area__area">{{ $t('area_size') }}: {{ area }}m2</div>
    
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
.project-area__area {
  width: 100%;
  background-color: #E4E4E4;
  height: 70px;
  display: block;
  text-align: center;
  line-height: 70px;
}

</style>
