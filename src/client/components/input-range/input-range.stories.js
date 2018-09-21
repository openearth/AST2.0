import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import InputRange from './input-range.vue'
import README from './README.md'

const stories = storiesOf('Input Range', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('input-range', InputRange)

stories.add(
  'Input Range',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<input-range/>',
  }),
)
