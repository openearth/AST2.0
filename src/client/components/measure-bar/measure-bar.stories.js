import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import MeasureBar from './measure-bar.vue'
import README from './README.md'

const stories = storiesOf('Measure Bar', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('measure-bar', MeasureBar)

stories.add(
  'Measure Bar',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<measure-bar/>',
  }),
)
