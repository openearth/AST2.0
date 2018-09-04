import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import MapBox from './map-box.vue'
import README from './README.md'

const stories = storiesOf('Map Box', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('map-box', MapBox)

stories.add(
  'Map Box',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<map-box/>',
  }),
)
