<template>
  <article class="pdf-export-projectarea-settings">
    <h2 class="md-title">
      Projectgebied kenmerken
    </h2>
    <p class="pdf-export-projectarea-settings__intro">
      Voor dit project zijn de volgende projectgebied instellingen gebruikt:
    </p>

    <dl class="pdf-export-projectarea-settings__description-list">
      <template v-for="setting in settings">
        <dt :key="`${setting.term}-term`">
          {{ setting.term }}
        </dt>
        <dd :key="`${setting.description}-description`">
          {{ setting.description }}
        </dd>
      </template>
    </dl>
  </article>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      projectSettings: state => state.project.settings.projectArea,
      areaSettings: state => state.data.areaSettings,
    }),
    ...mapGetters('flow', ['currentFilledInLevel']),
    settings() {
      if (this.currentFilledInLevel.level < 5) return []
      return Object.entries(this.projectSettings)
        .map(([key, value]) => {
          const areaSetting = this.areaSettings.find(setting => setting.key === key)
          let term = areaSetting.title
          let description = value

          if (typeof value == 'object') {
            const [selectedKey] =  Object.entries(value).find(([_entryKey, entryValue]) => entryValue === true)
            description = selectedKey
          }
          const chosenOpion = areaSetting.options.find(option => option.value === description)
          description = chosenOpion.title

          return { term, description }
        })
    },
  },
}
</script>

<style>
.pdf-export-projectarea-settings__description-list {
  display: grid;
  row-gap: 0.5rem;
  column-gap: 1.5rem;
  grid-template-columns: auto 1fr;
}

.pdf-export-projectarea-settings__intro {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
