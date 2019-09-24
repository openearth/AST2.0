<template>
  <md-tabs md-dynamic-height>
    <md-tab
      v-for="table in tables"
      :id="table.title"
      :key="table.title"
      :md-label="table.title"
    >
      <md-table>
        <md-table-row v-if="table.header">
          <md-table-head
            v-for="head in table.header"
            :key="head"
          >
            {{ head }}
          </md-table-head>
        </md-table-row>

        <template v-if="table.rows">
          <md-table-row
            v-for="(row, index) in table.rows"
            :key="index"
          >
            <md-table-cell
              v-for="(value, index) in row"
              :key="index"
            >
              {{ value }}
            </md-table-cell>
          </md-table-row>
        </template>
      </md-table>
    </md-tab>
  </md-tabs>
</template>

<script>
import mockData from './mockData';

export default {
  computed: {
    tables() {
      return mockData
    },
  },
}
</script>

<style>
</style>
