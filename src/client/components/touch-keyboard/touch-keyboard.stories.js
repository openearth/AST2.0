import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import TouchKeyboard from './touch-keyboard.vue'
import README from './README.md'

const stories = storiesOf('Touch Keyboard', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('touch-keyboard', TouchKeyboard)

stories.add(
  'Touch Keyboard',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<touch-keyboard/>',
  }),
)
