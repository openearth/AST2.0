import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import KpiTable from './kpi-table.vue'
import README from './README.md'

const stories = storiesOf('Kpi Table', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('kpi-table', KpiTable)

stories.add(
  'Kpi Table',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<kpi-table/>',
  }),
)
