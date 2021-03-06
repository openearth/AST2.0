import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import AppMenu from './app-menu.vue'
import README from './README.md'

const stories = storiesOf('App Menu', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('app-menu', AppMenu)

stories.add(
  'App Menu',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<app-menu/>',
  }),
)
