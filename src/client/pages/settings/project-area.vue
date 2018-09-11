<template>
  <div class="project-area">
    <div class="project-area__area-size"><strong>{{ $t('area_size') }}:</strong> {{ area }}m2</div>

    <form class="form project-area__form" @submit.prevent="onSubmit">
      <fieldset
        v-for="setting in areaSettings"
        :ref="setting.key"
        :key="setting.key"
        class="fieldset project-area__input-group">

        <legend class="legend">{{ setting.title }}</legend>

        <label
          v-for="option in setting.options"
          :key="option.value"
          class="project-area__input__label">

          <input
            :ref="`${setting.key}-${option.value}`"
            :id="option.value"
            :name="setting.key"
            :type="setting.multiple ? 'checkbox' : 'radio'"
            :required="setting.multiple ? false : true"
            class="project-area__input-group__input">

          {{ option.title }}
        </label>
      </fieldset>
      <input
        type="submit"
        class="submit-button project-area__form__submit-button"
        value="Next">
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState({
      projectArea: state => state.project.settings.area,
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
          const [{ checked }] = this.$refs[`${setting.key}-${option.value}`]

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
.project-area {
  overflow-y: scroll;
}

.project-area__area-size {
  font-size: 20px;
  line-height: 70px;
  text-align: center;
  width: 100%;
  height: 70px;
  background-color: #E4E4E4;
}

.project-area__form {
  padding: 1.5rem;
  column-count: 2;
}

.project-area__input-group {
  break-inside: avoid;
  page-break-inside: avoid; /* for Firefox */
  margin-bottom: var(--spacing-default);
}

.project-area__input__label {
  margin-bottom: .75rem;
}

.project-area__form__submit-button {
  display: block;
  margin-left: auto;
  margin-top: auto;
}
</style>
