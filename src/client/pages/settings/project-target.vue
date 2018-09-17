<template>
  <div>
    <h2 class="project-target__title md-title">{{ $t('goals_and_key_progress_indicators') }}</h2>
    <md-table
      v-for="(group, index) in kpiGroups"
      :key="index"
      class="project-target__table">
      <md-table-toolbar v-if="index === 0">
        <span class="md-subheading">{{ group.title }}</span>
      </md-table-toolbar>

      <md-table-row class="project-target__table-row">
        <md-table-head>{{ group.title }}</md-table-head>
        <md-table-head>{{ $t('kpi') }}</md-table-head>
        <md-table-head>{{ $t('target_value') }}</md-table-head>
      </md-table-row>

      <md-table-row
        v-for="kpi in group.kpis"
        :key="kpi.key"
        class="project-target__table-row">
        <md-table-cell width="33%">{{ kpi.title }}</md-table-cell>
        <md-table-cell width="7%">
          <md-checkbox
            :value="!targets[group.key][kpi.key].include"
            @change="value => setTarget({
              group: group.key,
              key: kpi.key,
              value: { include: !!value },
            })"
          />
        </md-table-cell>
        <md-table-cell width="60%">
          <md-field>
            <md-input
              :value="targets[group.key][kpi.key].value"
              type="number"
              @change="event => setTarget({
                group: group.key,
                key: kpi.key,
                value: { value: parseInt(event.target.value, 10) },
            })"/>
          </md-field>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
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
  },
}
</script>

<style scoped>
.project-target__title {
  margin-left: 1rem;
  padding-top: 1rem;
}

.project-target__table {
  margin-bottom: 2rem;
}

.md-field {
  margin: 0;
  padding: 0;
  min-height: 32px;
}
</style>
