import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import MapControls from './map-controls.vue'
import README from './README.md'

const stories = storiesOf('Map Controls', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('map-controls', MapControls)

stories.add(
  'Map Controls',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<map-controls/>',
  }),
)
