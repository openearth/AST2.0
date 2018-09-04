import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import MapBaseLayerSwitcher from './map-base-layer-switcher.vue'
import README from './README.md'

const stories = storiesOf('Map Base Layer Switcher', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('map-base-layer-switcher', MapBaseLayerSwitcher)

stories.add(
  'Map Base Layer Switcher',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<map-base-layer-switcher/>',
  }),
)
