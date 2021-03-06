import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import LogIn from './log-in.vue'
import README from './README.md'

const stories = storiesOf('Log In', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('log-in', LogIn)

stories.add(
  'Log In',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<log-in/>',
  }),
)
