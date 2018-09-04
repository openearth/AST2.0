import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import KpiPanel from './kpi-panel.vue'
import README from './README.md'

const stories = storiesOf('Kpi Panel', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('kpi-panel', KpiPanel)

stories.add(
  'Kpi Panel',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<kpi-panel/>',
  }),
)
