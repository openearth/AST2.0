import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import NumericInput from './numeric-input.vue'
import README from './README.md'

const stories = storiesOf('Numeric Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('numeric-input', NumericInput)

stories.add(
  'Numeric Input',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<numeric-input/>',
  }),
)
