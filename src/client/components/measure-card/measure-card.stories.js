import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import MeasureCard from './measure-card.vue'
import README from './README.md'

const stories = storiesOf('Measure Card', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('measure-card', MeasureCard)

stories.add(
  'Measure Card',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<measure-card/>',
  }),
)
