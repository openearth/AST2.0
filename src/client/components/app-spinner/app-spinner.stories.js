import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import AppSpinner from './app-spinner.vue'
import README from './README.md'

const stories = storiesOf('App Spinner', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('app-spinner', AppSpinner)

stories.add(
  'App Spinner',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<app-spinner/>',
  }),
)
