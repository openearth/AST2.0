<template>
  <section class="kpi-panel">
    <div class="kpi-panel__header">
      <h4>KPI Panel</h4>

      <div>
        <md-button class="md-icon-button" @click="areNumbersShown = true">
          <md-icon>format_list_numbered_rtl</md-icon>
        </md-button>

        <md-button class="md-icon-button" @click="areNumbersShown = false">
          <md-icon>insert_chart_outlined</md-icon>
        </md-button>
      </div>
    </div>

    <ul>
      <li
        v-for="(key, index) in Object.keys(kpis)"
        :key="index"
        class="kpi">
        <span>{{ key }}:</span>
        <span v-if="areNumbersShown">{{ kpis[key] }}</span>
        <meter
          v-else
          :value="kpis[key]"
          class="kpi__meter"
          min="0"
          max="10" />
      </li>
    </ul>

  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    kpis: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      areNumbersShown: true,
    }
  },
}
</script>

<style>
.kpi-panel {
  padding: 1rem 1.5rem;
  width: 265px;
}

.kpi {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.kpi__meter {
  flex-basis: 100%;
  border-radius: 10px;
}

.kpi-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

ul {
  padding: 0;
}

.kpi-panel__header .md-button:last-child {
  margin: 0;
}
</style>
