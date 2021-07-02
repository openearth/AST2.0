<template>
  <md-tabs
    md-dynamic-height
    class="kpi-table"
  >
    <md-tab
      v-for="table in tables"
      :id="table.title"
      :key="table.title"
      :md-label="table.title"
    >
      <md-table>
        <md-table-row v-if="table.header">
          <md-table-head
            v-for="(head, headIndex) in table.header"
            :key="head"
            class="kpi-table__head"
          >
            {{ head }}
            <template v-if="headIndex > 0 && (table.units || [])[headIndex] !== 'number'">
              (<unit-ouput
                :unit="(table.units || [])[headIndex]"
              />)
            </template>
          </md-table-head>
        </md-table-row>

        <template v-if="table.rows">
          <md-table-row
            v-for="(row, index) in table.rows"
            :key="index"
          >
            <md-table-cell
              v-for="(value, rowIndex) in row"
              :key="rowIndex"
            >
              <template v-if="rowIndex === 0">
                {{ value }}
              </template>
              <unit-ouput
                v-else
                :value="value"
                :unit="(table.units || [])[rowIndex]"
                hide-unit
              />
            </md-table-cell>
          </md-table-row>
        </template>
      </md-table>
    </md-tab>
  </md-tabs>
</template>

<script>
import { mapGetters } from 'vuex';
import UnitOuput from '~/components/unit-output'

export default {
  components: { UnitOuput },
  props: {
    showTableCoBenefits: {
      type: Boolean,
      default: true,
    },
    showTableClimateAndCosts: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters('project', ['tableClimateAndCosts', 'tableCoBenefits']),
    tables() {
      const tables = []

      if (this.tableClimateAndCosts && this.showTableClimateAndCosts) {
        tables.push(this.tableClimateAndCosts)
      }

      if (this.tableCoBenefits && this.showTableCoBenefits) {
        tables.push(this.tableCoBenefits)
      }

      return tables
    },
  },
}
</script>

<style>
.kpi-table__head {
  vertical-align: top;
}

.kpi-table__head .md-table-head-container {
  height: auto;
}

.kpi-table__head .md-table-head-label {
  max-width: 150px;
  height: auto;
  line-height: 1.5em;
  white-space: normal;
}

</style>
