<template>
  <div>
    <h2 class="project-target__title md-subheading">{{ $t('goals_and_key_progress_indicators') }}</h2>
    <md-table
      v-for="(group, index) in kpiGroups"
      :key="index"
      class="project-target__table">

      <md-table-toolbar class="project-target__title-toolbar">
        <span class="md-subheading">{{ group.title }}</span>
      </md-table-toolbar>

      <md-table-row class="project-target__table-row">
        <md-table-head>{{ $t('goal') }}</md-table-head>
        <md-table-head>{{ $t('target_value') }}</md-table-head>
      </md-table-row>

      <md-table-row
        v-for="kpi in group.kpis"
        :key="kpi.key"
        class="project-target__table-row">
        <md-table-cell width="40%">
          <md-checkbox
            :value="!targets[group.key][kpi.key].include"
            @change="value => setTarget({
              group: group.key,
              key: kpi.key,
              value: { include: !!value },
            })"
          />
          {{ kpi.title }}
        </md-table-cell>
        <md-table-cell width="60%">
          <numeric-input
            :label="kpi.title"
            :value="String(targets[group.key][kpi.key].value || '')"
            :on-change="value => setTarget({
              group: group.key,
              key: kpi.key,
              value: { value },
            })"
            hide-label
          >
            <span class="md-suffix">
              {{ unit(kpi.unit) }}
            </span>
          </numeric-input>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { NumericInput } from "../../components";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  middleware: ['access-level-project-area-settings'],
  components: { NumericInput },
  computed: {
    ...mapState('data', ['kpiGroups']),
    ...mapState({
      targets: state => state.project.settings.targets,
    }),
  },
  methods: {
    ...mapMutations({
      setTarget: 'project/setTarget',
    }),
    unit(...args) {
      return this.$store.getters['data/units/displayValue'](...args)
    },
  },
}
</script>

<style scoped>
.project-target__title {
  margin-left: 1.5rem;
  padding-top: 1rem;
}

.project-target__title-toolbar {
  align-items: flex-end;
}

.md-field {
  margin: 0;
  padding: 0;
  min-height: 32px;
}

.md-table {
  display: block;
}
</style>
