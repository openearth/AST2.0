import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import TextInput from './text-input.vue'
import README from './README.md'

const stories = storiesOf('Text Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('text-input', TextInput)

stories.add(
  'Text Input',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<text-input/>',
  }),
)
