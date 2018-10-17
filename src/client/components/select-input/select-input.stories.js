import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import SelectInput from './select-input.vue'
import README from './README.md'

const stories = storiesOf('Select Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('select-input', SelectInput)

stories.add(
  'Select Input',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<select-input/>',
  }),
)
