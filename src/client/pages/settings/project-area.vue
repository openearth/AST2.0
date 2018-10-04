<template>
  <div class="project-area">
    <md-toolbar md-elevation="0" class="md-transparent">
      <span class="md-subheading">{{ $t('area_size') }}: {{ area }}</span>
      <md-button :to="`/${locale}/new-project`" class="md-primary">{{ $t('change_area') }}</md-button>
    </md-toolbar>

    <form @submit.prevent="onSubmit">
      <md-list>
        <md-list-item
          v-for="setting in areaSettings"
          :key="setting.key"
          :md-expand="true"
          :md-expanded="true">
          <span class="md-list-item-text">{{ setting.title }}</span>

          <md-list slot="md-expand">
            <md-list-item
              v-for="option in setting.options"
              :key="option.value">
              <md-checkbox
                v-if="setting.multiple"
                :value="!projectAreaSettings[setting.key][option.value]"
                @change="value => setProjectAreaNestedSetting({
                  key: setting.key,
                  option: option.value,
                  value
                })"
              />
              <md-radio
                v-else
                :value="projectAreaSettings[setting.key] !== option.value"
                required
                @change="value => setProjectAreaSetting({
                  key: setting.key,
                  value: option.value,
                })"
              />
              <span class="md-list-item-text">{{ option.title }}</span>
            </md-list-item>
          </md-list>
        </md-list-item>
      </md-list>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'

export default {
  middleware: ['access-level-project-area'],
  computed: {
    ...mapState({
      locale: state => state.i18n.locale,
      projectArea: state => state.project.settings.area,
      projectAreaSettings: state => state.project.settings.projectArea,
      areaSettings: state => state.data.areaSettings,
    }),
    area() { return this.projectArea.properties && Math.round(this.projectArea.properties.area) },
  },
  methods: {
    ...mapMutations({
      onUpdateAreaSettings: 'project/updateProjectAreaSettings',
      setProjectAreaNestedSetting: 'project/toggleProjectAreaNestedSetting',
      setProjectAreaSetting: 'project/setProjectAreaSetting',
    }),
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
