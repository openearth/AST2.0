<template>
  <article class="pdf-export-projectarea-settings">
    <h2 class="md-title">
      {{ $t('pdf_projectarea_characteristics') }}
    </h2>

    <section class="pdf-export-projectarea-settings__wrapper">
      <article>
        <p class="pdf-export-projectarea-settings__intro">
          {{ $t('pdf_used_projectarea_settings') }}
        </p>
        <dl class="pdf-export-projectarea-settings__description-list">
          <template v-for="setting in settings">
            <dt :key="`${setting.term}-term`">
              {{ setting.term }}:
            </dt>
            <dd :key="`${setting.description}-description`">
              {{ setting.description }}
            </dd>
          </template>
        </dl>
      </article>
      <article>
        <p class="pdf-export-projectarea-settings__intro">
          {{ $t('pdf_used_projectarea_targets') }}
        </p>
        <section
          v-for="targetGroup in formattedTargets"
          :key="targetGroup.title"
          class="pdf-export-projectarea-settings__targets"
        >
          <header class="md-body-2">
            {{ targetGroup.title }}
          </header>
          <dl class="pdf-export-projectarea-settings__description-list">
            <template v-for="kpi in targetGroup.kpis">
              <dt :key="`${kpi.key}-term`">
                {{ kpi.key }}:
              </dt>
              <dd :key="`${kpi.value}-description`">
                {{ kpi.value }}
              </dd>
            </template>
          </dl>
        </section>
      </article>
    </section>
  </article>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      projectSettings: state => state.project.settings.projectArea,
      areaSettings: state => state.data.areaSettings,
      kpiGroups: state => state.data.kpiGroups,
      targets: state => state.project.settings.targets,
    }),
    ...mapGetters('flow', ['currentFilledInLevel']),
    ...mapGetters('data/workspaces', ['scenariosInActiveWorkspace']),
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

          const chosenOpion = key === 'scenarioName'
            ? this.scenariosInActiveWorkspace.find(option => option.value === description)
            : areaSetting.options.find(option => option.value === description)

          description = chosenOpion.title

          return { term, description }
        })
    },
    formattedTargets() {
      const foo = this.kpiGroups
        .map(group => {
          return {
            title: group.title,
            kpis: Object.entries(this.targets[group.key])
              .filter(([, value]) => value.include)
              .map(([key, { value }]) => ({
                key: group.kpis.find(kpi => kpi.key === key).title,
                value,
              })),
          }
        })
        .filter(group => group.kpis.length)
      console.log(foo)
      return foo
    },
  },
}
</script>

<style>
.pdf-export-projectarea-settings__wrapper {
  display: flex;
}

.pdf-export-projectarea-settings__wrapper > * {
  flex: 1;
}

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

.pdf-export-projectarea-settings__targets:not(:first-of-type) {
  margin-top: var(--spacing-default);
}
</style>
