import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import BarGraph from './bar-graph.vue'
import README from './README.md'

const stories = storiesOf('Bar Graph', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('bar-graph', BarGraph)

stories.add(
  'Bar Graph',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<bar-graph/>',
  }),
)
