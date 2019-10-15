import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import AppTooltip from './app-tooltip.vue'
import README from './README.md'

const stories = storiesOf('App Tooltip', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('app-tooltip', AppTooltip)

stories.add(
  'App Tooltip',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<app-tooltip/>',
  }),
)
