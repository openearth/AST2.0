<template>
  <div class="project-area">
    <div class="project-area__area-size"><strong>{{ $t('area_size') }}:</strong> {{ area }}m2</div>
    
    <form class="project-area__form" @submit.prevent="onSubmit">
      <fieldset
        v-for="setting in areaSettings"
        :ref="setting.key" 
        :key="setting.key"
        class="project-area__input-group">
        
        <legend class="project-area__input-group__legend">{{ setting.title }}</legend>
        
        <label 
          v-for="option in setting.options" 
          :key="option.value" 
          class="project-area__input-group__label">
          
          <input
            :ref="option.value"
            :id="option.value"
            :name="setting.key"
            :type="setting.multiple ? 'checkbox' : 'radio'"
            class="project-area__input-group__input">
          
          {{ option.title }}
        </label>
      </fieldset>
      <input
        type="submit"
        class="project-area__form__submit-button"
        value="Next">
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      projectArea: state => state.project.settings.projectArea,
      areaSettings: state => state.data.areaSettings,
    }),
    area() { return this.projectArea.properties && this.projectArea.properties.area.toFixed(2) },
  },
  methods: {
    ...mapMutations({ onUpdateAreaSettings: 'project/updateProjectAreaSettings' }),
    onSubmit(e) {
      let projectAreaSettings = {}

      this.areaSettings.forEach(setting => {
        if (setting.multiple) {
          projectAreaSettings[setting.key] = {}
        }

        setting.options.forEach(option => {
          const [{ checked }] = this.$refs[option.value]
          
          if (setting.multiple) {
            return projectAreaSettings[setting.key][option.value] = checked
          }

          if (checked) {
            projectAreaSettings[setting.key] = option.value
          }
        })
      })

      this.onUpdateAreaSettings(projectAreaSettings)
    },
  },
}
</script>

<style>
.project-area__area-size {
  width: 100%;
  background-color: #E4E4E4;
  height: 70px;
  font-size: 20px;
  line-height: 70px;
  text-align: center;
}

.project-area__form {
  height: 80vh;
  padding: 1.5rem;
  font-size: var(--font-size-medium);
  display: flex;
  flex-flow: column wrap;
}

.project-area__input-group {
  width: 45%;
  display: flex;
  flex-direction: column;
  border: none;
  margin-bottom: var(--spacing-default);
}

.project-area__input-group__legend {
  margin-bottom: var(--spacing-half);
  font-weight: bold;
}

.project-area__input-group__input {
  width: 25px;
  height: 25px;
  border: 1px solid var(--text-color);
  box-shadow: none;
  background-color: transparent;
  box-shadow: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: border .2s ease-in-out;
  vertical-align: -5px;
}

input[type='radio'] {
  border-radius: 50%;
  outline: none;
}

input[type='radio']:focus,
input[type='radio']:checked {
  border: 7px solid var(--text-color);
}

input[type='checkbox'] {
  position: relative;
}

input[type='checkbox']:before {
  content: '\2714';
  position: absolute;
  font-size: 18px;
  left: 0;
  bottom: 1px;
  opacity: 0;
  transition: opacity .1s ease-in-out;
}

input[type='checkbox']:checked:before {
  opacity: 1;
}

.project-area__input-group__label {
  margin-bottom: 12px;
}

.project-area__form__submit-button {
  background-color: var(--text-color);
  color: var(--background-color);
  padding: var(--spacing-half) var(--spacing-default);
  display: block;
  margin-left: auto;
  margin-top: auto;
}
</style>
