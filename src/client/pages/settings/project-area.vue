<template>
  <div class="project-area">
    <md-toolbar
      md-elevation="0"
      class="md-transparent project-area__area-size">
      <span class="md-subheading">{{ $t('area_size') }}: <strong>{{ area }}m<sup>2</sup></strong></span>
      <md-button :to="`/${locale}/new-project`" class="md-primary">{{ $t('change_area') }}</md-button>
    </md-toolbar>

    <form>
      <md-list>
        <md-list-item
          v-for="setting in areaSettings"
          :key="setting.key"
          :md-expand="true"
          :md-expanded="true">
          <span class="md-list-item-text">{{ setting.title }}</span>

          <md-list v-if="!setting.isSelect" slot="md-expand">
            <md-list-item
              v-for="option in setting.options"
              :key="option.value">
              <md-checkbox
                v-if="setting.multiple && !setting.isSelect"
                :value="!projectAreaSettings[setting.key][option.value]"
                @change="value => updateProjectAreaSetting({
                  type: 'checkbox',
                  key: setting.key,
                  option: option.value,
                  value
                })"
              />
              <md-radio
                v-else
                :value="projectAreaSettings[setting.key] !== option.value"
                required
                @change="value => updateProjectAreaSetting({
                  type: 'radio',
                  key: setting.key,
                  value: option.value,
                })"
              />
              <span class="md-list-item-text">{{ option.title }}</span>
            </md-list-item>
          </md-list>

          <md-list v-else slot="md-expand">
            <md-list-item>
              <select-input
                :options="setting.options"
                :selected-value="setting.defaultValue.value"
                :id="setting.key"
                @onSelect="value => updateProjectAreaSetting({
                  type: 'select',
                  key: setting.key,
                  value,
                })"
              />
            </md-list-item>
          </md-list>
        </md-list-item>
      </md-list>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { SelectInput } from '~/components'

export default {
  middleware: ['access-level-project-area'],
  components: { SelectInput },
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
    ...mapActions({
      updateProjectAreaSetting: 'project/updateProjectAreaSetting',
    }),
  },
}
</script>

<style>
.project-area__area-size {
  background-color: #eee !important;
  padding: var(--spacing-default);
  display: flex;
  justify-content: space-between;
}

.project-area .md-list-item-expand {
  border: none;
}
</style>
